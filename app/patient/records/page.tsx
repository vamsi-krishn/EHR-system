"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, FilePlus, Download, Search, Loader2 } from "lucide-react"
import { getPatientRecords } from "@/lib/blockchain"

export default function PatientRecordsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const userAddress = localStorage.getItem("userAddress")
    const userRole = localStorage.getItem("userRole")

    if (!userAddress || userRole !== "patient") {
      router.push("/login")
      return
    }

    const fetchRecords = async () => {
      try {
        const data = await getPatientRecords(userAddress)
        setRecords(data)
      } catch (error) {
        console.error("Error fetching patient records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [router])

  const filteredRecords = records.filter(
    (record) =>
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDownload = (fileHash: string, fileName: string) => {
    // In a real app, this would download the file from IPFS or another storage
    alert(`Downloading file: ${fileName} (${fileHash})`)
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading medical records...</p>
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
        <div className="flex flex-col max-w-6xl mx-auto">
          <div className="w-full mb-8">
            <Link href="/patient" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Medical Records</h1>
            <p className="text-muted-foreground">View and manage your medical documents and records</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link href="/patient/records/upload">
              <Button>
                <FilePlus className="h-4 w-4 mr-2" />
                Upload New Record
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Medical Records</CardTitle>
              <CardDescription>All your medical documents securely stored on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecords.length > 0 ? (
                <div className="space-y-4">
                  {filteredRecords.map((record) => (
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
                    {searchTerm ? "No records match your search criteria." : "You don't have any medical records yet."}
                  </p>
                  <Link href="/patient/records/upload">
                    <Button>Upload Your First Record</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
