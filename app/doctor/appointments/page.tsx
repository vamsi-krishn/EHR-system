"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Clock, CheckCircle2, XCircle, MessageSquare, Loader2 } from "lucide-react"
import { getDoctorData, updateAppointmentStatus } from "@/lib/blockchain"

export default function DoctorAppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [updating, setUpdating] = useState<string | null>(null)

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
        setAppointments(data?.appointments || [])
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    setUpdating(appointmentId)

    try {
      await updateAppointmentStatus(appointmentId, status)

      // Update local state
      setAppointments((prev) =>
        prev.map((appointment) => (appointment.id === appointmentId ? { ...appointment, status } : appointment)),
      )
    } catch (error) {
      console.error("Error updating appointment status:", error)
    } finally {
      setUpdating(null)
    }
  }

  const pendingAppointments = appointments.filter((a) => a.status === "Pending")
  const upcomingAppointments = appointments.filter((a) => a.status === "Confirmed")
  const pastAppointments = appointments.filter((a) => ["Completed", "Cancelled"].includes(a.status))

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
        </div>
      </header>

      <main className="container py-12">
        <div className="flex flex-col max-w-4xl mx-auto">
          <div className="w-full mb-8">
            <Link href="/doctor" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">Manage your patient appointments</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Appointments</CardTitle>
                  <CardDescription>Appointment requests that need your confirmation</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pendingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                            <Clock className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">
                                {appointment.patientId === "1" ? "John Smith" : "Sarah Johnson"}
                              </h4>
                              <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 px-2 py-0.5 rounded">
                                Pending
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                            <div className="flex items-center mt-2 mb-3">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(appointment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => handleUpdateStatus(appointment.id, "Confirmed")}
                                disabled={updating === appointment.id}
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleUpdateStatus(appointment.id, "Cancelled")}
                                disabled={updating === appointment.id}
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                )}
                                Decline
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Pending Requests</h3>
                      <p className="text-muted-foreground mt-1">
                        You don&apos;t have any pending appointment requests.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your confirmed upcoming appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
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
                            <div className="flex items-center mt-2 mb-3">
                              <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(appointment.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(appointment.id, "Completed")}
                                disabled={updating === appointment.id}
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                )}
                                Mark Completed
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleUpdateStatus(appointment.id, "Cancelled")}
                                disabled={updating === appointment.id}
                              >
                                {updating === appointment.id ? (
                                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 mr-1" />
                                )}
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Upcoming Appointments</h3>
                      <p className="text-muted-foreground mt-1">
                        You don&apos;t have any confirmed upcoming appointments.
                      </p>
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
                            {appointment.status === "Completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium">
                                {appointment.patientId === "1" ? "John Smith" : "Sarah Johnson"}
                              </h4>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  appointment.status === "Completed"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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
