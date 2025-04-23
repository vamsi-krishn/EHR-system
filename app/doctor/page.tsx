"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FileText, Users, Clock, LogOut, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { getDoctorData } from "@/lib/blockchain"

export default function DoctorDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [doctorData, setDoctorData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    if (!userAddress || userRole !== "doctor") {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        const data = await getDoctorData(userAddress)
        setDoctorData(data)
      } catch (error) {
        console.error("Error fetching doctor data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    // Clear all local storage items
    localStorage.clear()

    // Redirect to login page
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading doctor dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img src="/images/ehr-logo.svg" alt="EHR Logo" className="h-10 w-auto" />
            <span>EHR</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/doctor" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/doctor/patients" className="text-sm font-medium transition-colors hover:text-primary">
              Patients
            </Link>
            <Link href="/doctor/appointments" className="text-sm font-medium transition-colors hover:text-primary">
              Appointments
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{localStorage.getItem("userName") || "Doctor"}</span>
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
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your patients, appointments, and medical records</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {doctorData?.appointments?.filter((a: any) => {
                      const today = new Date().toDateString()
                      const appointmentDate = new Date(a.timestamp).toDateString()
                      return appointmentDate === today && a.status === "Confirmed"
                    }).length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Scheduled today</div>
                </div>
                <div className="mt-4">
                  <Link href="/doctor/appointments">
                    <Button size="sm" variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {doctorData?.appointments?.filter((a: any) => a.status === "Pending").length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Need confirmation</div>
                </div>
                <div className="mt-4">
                  <Link href="/doctor/appointments">
                    <Button size="sm" variant="outline" className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Manage Requests
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">
                    {/* This would be the count of patients who granted permission */}
                    12
                  </div>
                  <div className="text-sm text-muted-foreground">Total patients</div>
                </div>
                <div className="mt-4">
                  <Link href="/doctor/patients">
                    <Button size="sm" variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      View Patients
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
              <TabsTrigger value="recent-activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome, {localStorage.getItem("userName") || "Doctor"}</CardTitle>
                  <CardDescription>Your practice overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                          <Link href="/doctor/appointments">
                            <Button variant="outline" className="w-full justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              Manage Appointments
                            </Button>
                          </Link>
                          <Link href="/doctor/patients">
                            <Button variant="outline" className="w-full justify-start">
                              <Users className="h-4 w-4 mr-2" />
                              View Patient List
                            </Button>
                          </Link>
                          <Link href="/doctor/records/upload">
                            <Button variant="outline" className="w-full justify-start">
                              <FileText className="h-4 w-4 mr-2" />
                              Upload Medical Record
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Your Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Name:</span>
                            <span className="font-medium">{doctorData?.doctor?.name || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Specialization:</span>
                            <span className="font-medium">{doctorData?.doctor?.specialization || "Not available"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">License Number:</span>
                            <span className="font-medium">{doctorData?.doctor?.licenseNumber || "Not available"}</span>
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

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {doctorData?.appointments?.filter((a: any) => a.status === "Confirmed").length > 0 ? (
                    <div className="space-y-4">
                      {doctorData.appointments
                        .filter((a: any) => a.status === "Confirmed")
                        .map((appointment: any) => (
                          <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium">
                                  {appointment.patientId === "1" ? "John Smith" : "Sarah Johnson"}
                                </h4>
                                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">
                                  Confirmed
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
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
                      <p className="text-muted-foreground mt-1">You don&apos;t have any confirmed appointments.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent-activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* This would be populated with real data in a production app */}
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Medical Record Uploaded</h4>
                          <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You uploaded a new medical record for John Smith
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Appointment Confirmed</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Date.now() - 86400000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You confirmed an appointment with Sarah Johnson
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">Appointment Cancelled</h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Date.now() - 172800000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You cancelled an appointment with John Smith
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
