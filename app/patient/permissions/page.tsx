"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, User, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { getAllDoctors, grantPermission, revokePermission, checkPermission, getPermissionLogs } from "@/lib/blockchain"

export default function PermissionsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState<any[]>([])
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [permissionLogs, setPermissionLogs] = useState<any[]>([])
  const [updating, setUpdating] = useState<string | null>(null)

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
        // Get all doctors
        const doctorsData = await getAllDoctors()
        setDoctors(doctorsData)

        // Check permissions for each doctor
        const permissionsData: Record<string, boolean> = {}
        for (const doctor of doctorsData) {
          const hasPermission = await checkPermission(userAddress, doctor.walletAddress)
          permissionsData[doctor.walletAddress] = hasPermission
        }
        setPermissions(permissionsData)

        // Get permission logs
        const logs = await getPermissionLogs(userAddress)
        setPermissionLogs(logs)
      } catch (error) {
        console.error("Error fetching permissions data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handlePermissionChange = async (doctorAddress: string, granted: boolean) => {
    setUpdating(doctorAddress)
    const userAddress = localStorage.getItem("userAddress") || ""

    try {
      if (granted) {
        await grantPermission(userAddress, doctorAddress)
      } else {
        await revokePermission(userAddress, doctorAddress)
      }

      // Update local state
      setPermissions((prev) => ({
        ...prev,
        [doctorAddress]: granted,
      }))

      // Update permission logs
      const logs = await getPermissionLogs(userAddress)
      setPermissionLogs(logs)
    } catch (error) {
      console.error("Error updating permission:", error)
      // Revert the UI state on error
      setPermissions((prev) => ({
        ...prev,
        [doctorAddress]: !granted,
      }))
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500 mb-4" />
          <p>Loading permissions...</p>
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
            <h1 className="text-3xl font-bold">Doctor Permissions</h1>
            <p className="text-muted-foreground">Control which doctors can access your medical records</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-500" />
                Permission Control
              </CardTitle>
              <CardDescription>
                Toggle access permissions for healthcare providers. Only doctors with permission can view your medical
                records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center p-2 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Granting permission allows a doctor to view all your medical records. You can revoke access at any
                    time.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
                          <User className="h-4 w-4 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{doctor.name}</h4>
                          <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {updating === doctor.walletAddress ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : permissions[doctor.walletAddress] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : null}
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`permission-${doctor.id}`}
                            checked={permissions[doctor.walletAddress] || false}
                            onCheckedChange={(checked) => handlePermissionChange(doctor.walletAddress, checked)}
                            disabled={updating === doctor.walletAddress}
                          />
                          <Label htmlFor={`permission-${doctor.id}`} className="text-sm">
                            {permissions[doctor.walletAddress] ? "Access Granted" : "No Access"}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Doctors Found</h3>
                    <p className="text-muted-foreground mt-1">There are no doctors available in the system yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permission Activity Log</CardTitle>
              <CardDescription>Recent changes to your permission settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissionLogs.length > 0 ? (
                  permissionLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div
                        className={`rounded-full p-2 ${log.granted ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                      >
                        {log.granted ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {log.granted ? "Access Granted to " : "Access Revoked from "}
                            {log.doctorName}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          You {log.granted ? "granted" : "revoked"} access to your medical records
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Permission Activity</h3>
                    <p className="text-muted-foreground mt-1">You haven't made any permission changes yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
