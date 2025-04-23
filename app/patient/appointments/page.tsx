"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, Plus, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { getPatientData } from "@/lib/blockchain"

export default function AppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("upcoming")

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
        setAppointments(data?.appointments || [])
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const upcomingAppointments = appointments.filter((a) => a.status === "Confirmed" || a.status === "Pending")

  const pastAppointments = appointments.filter((a) => a.status === "Completed" || a.status === "Cancelled")

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-amber-600" />
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case "Cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading appointments...</p>
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
        </div>
      </header>

      <main className="container py-12">
        <div className="flex flex-col max-w-4xl mx-auto">
          <div className="w-full mb-8">
            <Link href="/patient" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">Manage your doctor appointments</p>
              </div>
              <Link href="/patient/appointments/book">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled and pending appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div
                            className={`rounded-full p-2 ${
                              appointment.status === "Confirmed"
                                ? "bg-green-100 dark:bg-green-900"
                                : "bg-amber-100 dark:bg-amber-900"
                            }`}
                          >
                            {getStatusIcon(appointment.status)}
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
                                className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(appointment.status)}`}
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

            <TabsContent value="past" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                  <CardDescription>Your completed and cancelled appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div
                            className={`rounded-full p-2 ${
                              appointment.status === "Completed"
                                ? "bg-blue-100 dark:bg-blue-900"
                                : "bg-red-100 dark:bg-red-900"
                            }`}
                          >
                            {getStatusIcon(appointment.status)}
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
                                className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeClass(appointment.status)}`}
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
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Past Appointments</h3>
                      <p className="text-muted-foreground mt-1">You don&apos;t have any past appointments.</p>
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
