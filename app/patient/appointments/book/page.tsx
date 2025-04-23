"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Loader2 } from "lucide-react"
import { getAllDoctors, bookAppointment } from "@/lib/blockchain"

export default function BookAppointmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    if (!userAddress || userRole !== "patient") {
      router.push("/login")
      return
    }

    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors()
        setDoctors(data)
      } catch (error) {
        console.error("Error fetching doctors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const selectedDoctor = doctors.find((d) => d.id === formData.doctorId)
      if (!selectedDoctor) {
        throw new Error("Please select a doctor")
      }

      // Combine date and time into a timestamp
      const timestamp = new Date(`${formData.date}T${formData.time}`).toISOString()

      const appointmentData = {
        doctor: selectedDoctor.walletAddress,
        timestamp,
        reason: formData.reason,
      }

      await bookAppointment(appointmentData)

      // Redirect to appointments page after successful booking
      router.push("/patient/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Failed to book appointment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading doctors...</p>
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
        <div className="flex flex-col max-w-2xl mx-auto">
          <div className="w-full mb-8">
            <Link href="/patient/appointments" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Appointments
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Book Appointment</h1>
            <p className="text-muted-foreground">Schedule a new appointment with a doctor</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Appointment</CardTitle>
              <CardDescription>Fill in the details to book your appointment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="doctor">Select Doctor</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) => setFormData({ ...formData, doctorId: value })}
                    required
                  >
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]} // Prevent past dates
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea
                    id="reason"
                    placeholder="Briefly describe the reason for your appointment"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Appointment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Your appointment request will be sent to the doctor for confirmation.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
