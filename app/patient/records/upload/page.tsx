"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Loader2, FileText } from "lucide-react"
import { addMedicalRecord } from "@/lib/blockchain"

export default function UploadRecordPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fileType: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])

      // Auto-detect file type from extension
      const fileName = e.target.files[0].name
      const extension = fileName.split(".").pop()?.toLowerCase() || ""

      if (extension === "pdf") {
        setFormData((prev) => ({ ...prev, fileType: "pdf" }))
      } else if (["jpg", "jpeg", "png"].includes(extension)) {
        setFormData((prev) => ({ ...prev, fileType: "image" }))
      } else if (["dcm", "dicom"].includes(extension)) {
        setFormData((prev) => ({ ...prev, fileType: "dicom" }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!selectedFile) {
        throw new Error("Please select a file to upload")
      }

      // In a real app, you would upload the file to IPFS or another storage
      // and get back a hash/URL to store on the blockchain
      const mockFileHash = `QmHash${Math.random().toString(36).substring(2, 15)}`

      const recordData = {
        title: formData.title,
        description: formData.description,
        fileHash: mockFileHash,
        fileType: formData.fileType,
        patientAddress: localStorage.getItem("userAddress") || "",
      }

      await addMedicalRecord(recordData)

      // Redirect to records page after successful upload
      router.push("/patient/records")
    } catch (error) {
      console.error("Error uploading record:", error)
      alert("Failed to upload record. Please try again.")
    } finally {
      setLoading(false)
    }
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
            <Link href="/patient/records" className="inline-block mb-4">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Records
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Upload Medical Record</h1>
            <p className="text-muted-foreground">Add a new medical document to your blockchain-secured health record</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>New Medical Record</CardTitle>
              <CardDescription>
                Upload a medical document such as a lab report, prescription, or scan result
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Annual Physical Results"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the document"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileType">Document Type</Label>
                  <Select
                    value={formData.fileType}
                    onValueChange={(value) => setFormData({ ...formData, fileType: value })}
                    required
                  >
                    <SelectTrigger id="fileType">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="image">Image (JPG, PNG)</SelectItem>
                      <SelectItem value="dicom">DICOM (Medical Imaging)</SelectItem>
                      <SelectItem value="lab">Lab Results</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-8 w-8 text-teal-500 mb-2" />
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">Click to select a file</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports PDF, JPG, PNG, DICOM files up to 50MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Record"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Your medical record will be securely stored on the blockchain with access controlled by you.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
