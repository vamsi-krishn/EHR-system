"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Search, Shield, Loader2, FileText, Calendar } from "lucide-react"

// Mock data for patients with permissions
const mockPatients = [
  {
    id: "1",
    name: "John Smith",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    contactInfo: "john.smith@email.com",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    hasPermission: true,
    recordCount: 3,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    dateOfBirth: "1990-08-22",
    gender: "Female",
    contactInfo: "sarah.j@email.com",
    walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
    hasPermission: true,
    recordCount: 1,
  },
  {
    id: "3",
    name: "Michael Brown",
    dateOfBirth: "1978-11-30",
    gender: "Male",
    contactInfo: "michael.b@email.com",
    walletAddress: "0x3456789012abcdef3456789012abcdef34567890",
    hasPermission: false,
    recordCount: 0,
  },
  {
    id: "4",
    name: "Emily Davis",
    dateOfBirth: "1992-03-17",
    gender: "Female",
    contactInfo: "emily.d@email.com",
    walletAddress: "0x4567890123abcdef4567890123abcdef45678901",
    hasPermission: true,
    recordCount: 2,
  },
]

export default function PatientsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    if (!userAddress || userRole !== "doctor") {
      router.push("/login")
      return
    }

    // Simulate fetching patients data
    setTimeout(() => {
      setPatients(mockPatients)
      setLoading(false)
    }, 1000)
  }, [router])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading patients...</p>
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
        <div className="flex flex-col max-w-6xl mx-auto">
          <div className="w-full mb-8">
            <Link href="/doctor" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Patients</h1>
            <p className="text-muted-foreground">View and manage your patients</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Patients</CardTitle>
              <CardDescription>Patients who have granted you access to their medical records</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPatients.length > 0 ? (
                <div className="space-y-4">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`rounded-full p-2 ${
                          patient.hasPermission ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <Users className={`h-4 w-4 ${patient.hasPermission ? "text-green-600" : "text-gray-500"}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{patient.name}</h4>
                          {patient.hasPermission ? (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              Access Granted
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-2 py-0.5 rounded flex items-center">
                              <Shield className="h-3 w-3 mr-1" />
                              No Access
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">DOB:</span> {patient.dateOfBirth}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Gender:</span> {patient.gender}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Contact:</span> {patient.contactInfo}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Records:</span> {patient.recordCount}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {patient.hasPermission ? (
                            <>
                              <Link href={`/doctor/patients/${patient.id}`}>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-3.5 w-3.5 mr-1" />
                                  View Records
                                </Button>
                              </Link>
                              <Link href={`/doctor/patients/${patient.id}/appointments`}>
                                <Button size="sm" variant="outline">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  Appointments
                                </Button>
                              </Link>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
                              <Shield className="h-3.5 w-3.5 mr-1" />
                              Access Required
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Patients Found</h3>
                  <p className="text-muted-foreground mt-1">
                    {searchTerm ? "No patients match your search criteria." : "You don't have any patients yet."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
