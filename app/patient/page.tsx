"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, FilePlus, Users, Clock, Shield, LogOut, Loader2 } from "lucide-react"
import { getPatientData } from "@/lib/blockchain"

export default function PatientDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patientData, setPatientData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    if (!userAddress || userRole !== "patient") {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const data = await getPatientData(userAddress)
        setPatientData(
          data || {
            patient: {
              name: localStorage.getItem("userName") || "Patient",
              dateOfBirth: "Not available",
              gender: "Not available",
              contactInfo: "Not available",
            },
            records: [],
            appointments: [],
          },
        )
      } catch (error) {
        console.error("Error fetching patient data:", error)
        // Set default data if fetch fails
        setPatientData({
          patient: {
            name: localStorage.getItem("userName") || "Patient",
            dateOfBirth: "Not available",
            gender: "Not available",
            contactInfo: "Not available",
          },
          records: [],
          appointments: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userAddress")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading patient dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img src="/images/medbloc-logo.png" alt="MedBloc Logo" className="h-10 w-auto" />
            <span>MedBloc</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/patient" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/patient/records" className="text-sm font-medium transition-colors hover:text-primary">
              Medical Records
            </Link>
            <Link href="/patient/appointments" className="text-sm font-medium transition-colors hover:text-primary">
              Appointments
            </Link>
            <Link href="/patient/permissions" className="text-sm font-medium transition-colors hover:text-primary">
              Permissions
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{localStorage.getItem("userName") || "Patient"}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="flex flex-col max-w-6xl mx-auto">
          <div className="w-full mb-8">
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="text-muted-foreground">Manage your medical records, appointments, and doctor permissions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{patientData?.records?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total records</div>
                </div>
                <div className="mt-4">
                  <Link href="/patient/records">
                    <Button size="sm" variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View Records
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {patientData?.appointments?.filter((a: any) => a.status === "Confirmed").length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Scheduled</div>
                </div>
                <div className="mt-4">
                  <Link href="/patient/appointments">
                    <Button size="sm" variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Appointments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Doctor Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{/* This would be the count of doctors with permission */}2</div>
                  <div className="text-sm text-muted-foreground">Authorized doctors</div>
                </div>
                <div className="mt-4">
                  <Link href="/patient/permissions">
                    <Button size="sm" variant="outline" className="w-full">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Permissions
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recent-records">Recent Records</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {localStorage.getItem("userName") || "Patient"}</CardTitle>
                  <CardDescription>Your health information at a glance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <Link href="/patient/records/upload">
                            <Button variant="outline" className="w-full justify-start">
                              <FilePlus className="h-4 w-4 mr-2" />
                              Upload New Document
                            </Button>
                          </Link>
                          <Link href="/patient/appointments/book">
                            <Button variant="outline" className="w-full justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              Book New Appointment
                            </Button>
                          </Link>
                          <Link href="/patient/permissions">
                            <Button variant="outline" className="w-full justify-start">
                              <Users className="h-4 w-4 mr-2" />
                              Manage Doctor Access
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Your Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{patientData?.patient?.name || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date of Birth:</span>
                            <span className="font-medium">{patientData?.patient?.dateOfBirth || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Gender:</span>
                            <span className="font-medium">{patientData?.patient?.gender || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="font-medium">{patientData?.patient?.contactInfo || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Wallet Address:</span>
                            <span className="font-medium text-xs">
                              {localStorage.getItem("userAddress")?.substring(0, 10)}...
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent-records" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Medical Records</CardTitle>
                  <CardDescription>Your latest medical documents and records</CardDescription>
                </CardHeader>
                <CardContent>
                  {patientData?.records?.length > 0 ? (
                    <div className="space-y-4">
                      {patientData.records.slice(0, 5).map((record: any) => (
                        <div key={record.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
                            <FileText className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{record.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(record.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                            <div className="flex items-center mt-2">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                {record.fileType.toUpperCase()}
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                Added by: Dr.{" "}
                                {record.doctorId === "1"
                                  ? "Michael Chen"
                                  : record.doctorId === "2"
                                    ? "Emily Williams"
                                    : "Robert Garcia"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-center mt-4">
                        <Link href="/patient/records">
                          <Button variant="outline">View All Records</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Records Found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">You don&apos;t have any medical records yet.</p>
                      <Link href="/patient/records/upload">
                        <Button>Upload Your First Record</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled doctor appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {patientData?.appointments?.filter((a: any) => a.status === "Confirmed" || a.status === "Pending")
                    .length > 0 ? (
                    <div className="space-y-4">
                      {patientData.appointments
                        .filter((a: any) => a.status === "Confirmed" || a.status === "Pending")
                        .map((appointment: any) => (
                          <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div
                              className={`rounded-full p-2 ${
                                appointment.status === "Confirmed"
                                  ? "bg-green-100 dark:bg-green-900"
                                  : "bg-amber-100 dark:bg-amber-900"
                              }`}
                            >
                              <Clock
                                className={`h-4 w-4 ${
                                  appointment.status === "Confirmed" ? "text-green-600" : "text-amber-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">
                                  Dr.{" "}
                                  {appointment.doctorId === "1"
                                    ? "Michael Chen"
                                    : appointment.doctorId === "2"
                                      ? "Emily Williams"
                                      : "Robert Garcia"}
                                </h4>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    appointment.status === "Confirmed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                  }`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                              <div className="flex items-center mt-2">
                                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(appointment.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      <div className="flex justify-center mt-4">
                        <Link href="/patient/appointments">
                          <Button variant="outline">Manage All Appointments</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
                      <p className="text-muted-foreground mt-1 mb-4">You don&apos;t have any scheduled appointments.</p>
                      <Link href="/patient/appointments/book">
                        <Button>Book an Appointment</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
