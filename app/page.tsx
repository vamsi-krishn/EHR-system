import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Lock, Shield, UserPlus, Calendar, ClipboardCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img src="/images/medbloc-logo.png" alt="MedBloc Logo" className="h-10 w-auto" />
            <span>MedBloc</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/doctors" className="text-sm font-medium transition-colors hover:text-primary">
              Doctors
            </Link>
            <Link href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline" size="sm">
                Register
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/20 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    MedBloc: Secure Medical Records on Blockchain
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Patient-controlled electronic health records with secure access management and complete privacy.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="px-8">
                      Register Now
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0 flex items-center justify-center">
                <div className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 p-1">
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-6 shadow-lg">
                    <div className="flex flex-col space-y-2 text-center">
                      <h3 className="font-bold text-xl">Your Health, Your Control</h3>
                      <p className="text-sm text-muted-foreground">Secure, private, and accessible medical records</p>
                      <div className="mt-4 flex justify-center">
                        <div className="w-full max-w-sm rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                          <div className="flex flex-col space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
                                <FileText className="h-4 w-4 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Medical Records</p>
                                <p className="text-xs text-muted-foreground">Securely stored on blockchain</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
                                <Lock className="h-4 w-4 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Permission Control</p>
                                <p className="text-xs text-muted-foreground">You decide who can access your data</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-teal-100 p-2 dark:bg-teal-900">
                                <Calendar className="h-4 w-4 text-teal-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Appointment Booking</p>
                                <p className="text-xs text-muted-foreground">Schedule visits with your doctors</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Blockchain for Healthcare?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform leverages blockchain technology to provide a secure, transparent, and patient-controlled
                  electronic health record system.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Shield className="h-8 w-8 text-teal-500" />
                  <CardTitle className="text-xl">Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Cryptographic security ensures your medical records cannot be tampered with. Each record is securely
                    stored on the blockchain.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Lock className="h-8 w-8 text-teal-500" />
                  <CardTitle className="text-xl">Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    You control who can access your medical records. Grant and revoke permissions to healthcare
                    providers at any time.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <ClipboardCheck className="h-8 w-8 text-teal-500" />
                  <CardTitle className="text-xl">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    Access your complete medical history anytime, anywhere. Share records with new healthcare providers
                    instantly.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple, secure, and patient-centered electronic health records
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <UserPlus className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Register</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account using your MetaMask wallet. Your wallet address serves as your unique identifier.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <FileText className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Manage Records</h3>
                <p className="text-sm text-muted-foreground">
                  View your medical records and control which healthcare providers can access them.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                  <Calendar className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold">Book Appointments</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule appointments with healthcare providers and manage your healthcare journey.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} MedBloc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
