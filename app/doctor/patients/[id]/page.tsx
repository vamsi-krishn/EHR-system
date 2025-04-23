"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Download, FilePlus, Calendar, Loader2 } from "lucide-react"
import { getPatientRecords } from "@/lib/blockchain"

// Mock patient data
const mockPatients = {
  "1": {
    id: "1",
    name: "John Smith",
    dateOfBirth: "1985-05-15",
    gender: "Male",
    contactInfo: "john.smith@email.com",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
  },
  "2": {
    id: "2",
    name: "Sarah Johnson",
    dateOfBirth: "1990-08-22",
    gender: "Female",
    contactInfo: "sarah.j@email.com",
    walletAddress: "0x2345678901abcdef2345678901abcdef23456789",
  },
}

export default function PatientRecordsPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<any>(null)
  const [records, setRecords] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("records")

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
        // Get patient info
        const patientData = mockPatients[patientId]
        if (!patientData) {
          throw new Error("Patient not found")
        }
        setPatient(patientData)

        // Get patient records
        const recordsData = await getPatientRecords(patientData.walletAddress)
        setRecords(recordsData)
      } catch (error) {
        console.error("Error fetching patient data:", error)
        router.push("/doctor/patients")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, patientId])

  const handleDownload = (fileHash: string, fileName: string) => {
    // In a real app, this would download the file from IPFS or another storage
    alert(`Downloading file: ${fileName} (${fileHash})`)
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading patient records...</p>
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
            <Link href="/doctor/patients" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Patients
              </Button>
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <p className="text-muted-foreground">Patient records and information</p>
              </div>
              <Link href={`/doctor/patients/${patientId}/upload`}>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{patient.dateOfBirth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{patient.contactInfo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="records">Medical Records</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                  <CardDescription>Patient's medical documents and records</CardDescription>
                </CardHeader>
                <CardContent>
                  {records.length > 0 ? (
                    <div className="space-y-4">
                      {records.map((record) => (
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
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center">
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
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownload(record.fileHash, record.title)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Records Found</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        This patient doesn't have any medical records yet.
                      </p>
                      <Link href={`/doctor/patients/${patientId}/upload`}>
                        <Button>Add First Record</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>Appointments with this patient</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Appointments Found</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                      You don't have any appointments with this patient.
                    </p>
                    <Button>Schedule Appointment</Button>
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
