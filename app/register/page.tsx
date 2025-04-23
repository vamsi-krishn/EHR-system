"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react"
import { connectWallet, registerPatient, registerDoctor } from "@/lib/blockchain"

export default function RegisterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("patient")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [error, setError] = useState("")
  const [patientData, setPatientData] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contactInfo: "",
    walletAddress: "",
  })
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    licenseNumber: "",
    contactInfo: "",
    walletAddress: "",
  })

  // Check if user is already logged in
  useEffect(() => {
    // Clear any existing session data to ensure a fresh registration
    localStorage.removeItem("userAddress")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
  }, [])

  const handleConnect = async () => {
    setLoading(true)
    setError("")

    try {
      // Force MetaMask to show the account selection modal
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        })
      }

      // Now connect the wallet
      const address = await connectWallet()
      console.log("Connected wallet address for registration:", address)

      if (activeTab === "patient") {
        setPatientData({ ...patientData, walletAddress: address })
      } else {
        setDoctorData({ ...doctorData, walletAddress: address })
      }
      setStep(2)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setError("Failed to connect wallet. Please make sure MetaMask is installed and unlocked.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Verify the wallet is still connected
      const currentAddress = await connectWallet()

      // Check if the connected wallet matches the one in the form
      if (currentAddress.toLowerCase() !== patientData.walletAddress.toLowerCase()) {
        setError("Wallet address has changed. Please reconnect your wallet.")
        setLoading(false)
        return
      }

      await registerPatient(patientData)

      // Store user data in local storage for immediate login
      localStorage.setItem("userAddress", patientData.walletAddress)
      localStorage.setItem("userRole", "patient")
      localStorage.setItem("userName", patientData.name)

      setRegistered(true)
    } catch (error) {
      console.error("Error registering patient:", error)
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Verify the wallet is still connected
      const currentAddress = await connectWallet()

      // Check if the connected wallet matches the one in the form
      if (currentAddress.toLowerCase() !== doctorData.walletAddress.toLowerCase()) {
        setError("Wallet address has changed. Please reconnect your wallet.")
        setLoading(false)
        return
      }

      await registerDoctor(doctorData)

      // Store user data in local storage for immediate login
      localStorage.setItem("userAddress", doctorData.walletAddress)
      localStorage.setItem("userRole", "doctor")
      localStorage.setItem("userName", doctorData.name)

      setRegistered(true)
    } catch (error) {
      console.error("Error registering doctor:", error)
      setError("Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleContinueToDashboard = () => {
    const role = localStorage.getItem("userRole")
    if (role === "patient") {
      router.push("/patient")
    } else if (role === "doctor") {
      router.push("/doctor")
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Link href="/" className="mr-auto">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/images/ehr-logo.svg" alt="EHR Logo" className="h-10 w-auto" />
            <CardTitle className="text-2xl">Register</CardTitle>
          </div>
          <CardDescription>Create a new account to use EHR</CardDescription>
        </CardHeader>
        <CardContent>
          {registered ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-teal-500 mb-4" />
              <h3 className="text-xl font-bold">Registration Successful!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                You are now registered with EHR. You can now access your dashboard.
              </p>
              <Button onClick={handleContinueToDashboard}>Go to Dashboard</Button>
            </div>
          ) : step === 1 ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="patient">Patient</TabsTrigger>
                  <TabsTrigger value="doctor">Doctor</TabsTrigger>
                </TabsList>
                <TabsContent value="patient" className="mt-4 text-center">
                  <p className="text-muted-foreground mb-4">
                    Register as a patient to securely store and manage your medical records.
                  </p>
                </TabsContent>
                <TabsContent value="doctor" className="mt-4 text-center">
                  <p className="text-muted-foreground mb-4">
                    Register as a healthcare provider to access patient records with consent.
                  </p>
                </TabsContent>
              </Tabs>
              <p className="text-sm text-center mb-2">
                Connect your Ethereum wallet to register. This wallet will be used to securely identify you.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <Button onClick={handleConnect} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </div>
          ) : activeTab === "patient" ? (
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={patientData.name}
                  onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={patientData.dateOfBirth}
                  onChange={(e) => setPatientData({ ...patientData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={patientData.gender}
                  onValueChange={(value) => setPatientData({ ...patientData, gender: value })}
                  required
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  id="contactInfo"
                  placeholder="Email or phone number"
                  value={patientData.contactInfo}
                  onChange={(e) => setPatientData({ ...patientData, contactInfo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input id="walletAddress" value={patientData.walletAddress} readOnly className="bg-muted" />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegisterDoctor} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorName">Full Name</Label>
                <Input
                  id="doctorName"
                  placeholder="Enter your full name"
                  value={doctorData.name}
                  onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={doctorData.specialization}
                  onValueChange={(value) => setDoctorData({ ...doctorData, specialization: value })}
                  required
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="dermatology">Dermatology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                    <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="general-practice">General Practice</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">Medical License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="Enter your license number"
                  value={doctorData.licenseNumber}
                  onChange={(e) => setDoctorData({ ...doctorData, licenseNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorContactInfo">Contact Information</Label>
                <Input
                  id="doctorContactInfo"
                  placeholder="Email or phone number"
                  value={doctorData.contactInfo}
                  onChange={(e) => setDoctorData({ ...doctorData, contactInfo: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorWalletAddress">Wallet Address</Label>
                <Input id="doctorWalletAddress" value={doctorData.walletAddress} readOnly className="bg-muted" />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            By registering, you agree to the terms and conditions of the EHR platform.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
