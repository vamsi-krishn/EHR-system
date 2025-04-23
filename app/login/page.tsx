"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { connectWallet, checkRegistration } from "@/lib/blockchain"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      const address = await connectWallet()

      // Check if the address is registered directly using our blockchain function
      const registrationStatus = await checkRegistration(address)

      if (!registrationStatus.isRegistered) {
        setError("Wallet not registered. Please register first.")
        setLoading(false)
        return
      }

      // For demo purposes, we'll use local storage to simulate authentication
      localStorage.setItem("userAddress", address)
      localStorage.setItem("userRole", registrationStatus.role)
      localStorage.setItem("userName", registrationStatus.name)

      // Redirect based on role
      if (registrationStatus.role === "patient") {
        router.push("/patient")
      } else if (registrationStatus.role === "doctor") {
        router.push("/doctor")
      } else if (registrationStatus.role === "admin") {
        router.push("/admin")
      } else {
        // If not registered, redirect to registration
        router.push("/register")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Failed to connect wallet. Please try again.")
    } finally {
      setLoading(false)
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
            <img src="/images/medbloc-logo.png" alt="MedBloc Logo" className="h-10 w-auto" />
            <CardTitle className="text-2xl">Login</CardTitle>
          </div>
          <CardDescription>Connect your wallet to access your MedBloc account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
          <p className="text-center text-muted-foreground mb-4">
            Connect your Ethereum wallet to securely access your medical records and appointments.
          </p>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg w-full">
              <p className="text-sm">{error}</p>
            </div>
          )}
          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
          <p className="text-sm text-center mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Your wallet address is used as your secure identifier on the blockchain.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
