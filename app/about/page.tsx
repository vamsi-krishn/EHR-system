import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Shield, Lock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <img src="/images/ehr-logo.svg" alt="EHR Logo" className="h-10 w-auto" />
            <span>EHR</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary font-bold">
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  About Our EHR System
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  Revolutionizing healthcare with blockchain technology for secure, patient-controlled medical records.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Our Mission</h2>
                <p className="text-muted-foreground md:text-lg mb-6">
                  Our mission is to empower patients with complete control over their medical records while providing
                  healthcare providers with secure, efficient access to critical patient information.
                </p>
                <p className="text-muted-foreground md:text-lg">
                  By leveraging blockchain technology, we ensure that medical records are tamper-proof, transparent, and
                  accessible only to authorized individuals. This approach eliminates data silos, reduces medical
                  errors, and improves the overall quality of healthcare.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="rounded-xl bg-gradient-to-r from-teal-400 to-cyan-500 p-1">
                  <div className="rounded-lg bg-white dark:bg-gray-950 p-8 shadow-lg">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-4">
                        <Shield className="h-10 w-10 text-teal-500" />
                        <div>
                          <h3 className="font-bold text-xl">Security First</h3>
                          <p className="text-sm text-muted-foreground">Military-grade encryption for your data</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Lock className="h-10 w-10 text-teal-500" />
                        <div>
                          <h3 className="font-bold text-xl">Patient Control</h3>
                          <p className="text-sm text-muted-foreground">You decide who accesses your records</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <FileText className="h-10 w-10 text-teal-500" />
                        <div>
                          <h3 className="font-bold text-xl">Complete History</h3>
                          <p className="text-sm text-muted-foreground">All your medical records in one place</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Technology</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Built on the Ethereum blockchain with cutting-edge security features
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Blockchain Foundation</h3>
                <p className="text-muted-foreground">
                  Our system is built on Ethereum, providing an immutable ledger that ensures the integrity of all
                  medical records.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Smart Contracts</h3>
                <p className="text-muted-foreground">
                  Automated permission management through smart contracts ensures that only authorized healthcare
                  providers can access patient records.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Decentralized Storage</h3>
                <p className="text-muted-foreground">
                  Medical records are stored securely across a distributed network, eliminating single points of
                  failure.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
                <p className="text-muted-foreground">
                  All data is encrypted end-to-end, ensuring that only authorized parties can decrypt and view sensitive
                  medical information.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Wallet Authentication</h3>
                <p className="text-muted-foreground">
                  Secure authentication using blockchain wallets eliminates password vulnerabilities and provides
                  stronger identity verification.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3">Audit Trail</h3>
                <p className="text-muted-foreground">
                  Complete, immutable record of all access and modifications to medical records for full transparency
                  and accountability.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EHR. All rights reserved.
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
