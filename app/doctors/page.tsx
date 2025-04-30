import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, Star } from "lucide-react"

export default function DoctorsPage() {
  // Sample doctor data
  const doctors = [
    {
      id: 1,
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      experience: "15 years",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Chen is a board-certified cardiologist specializing in preventive cardiology and heart disease management.",
    },
    {
      id: 2,
      name: "Dr. Emily Williams",
      specialty: "Neurology",
      experience: "12 years",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Williams is an expert in neurological disorders with a focus on stroke prevention and treatment.",
    },
    {
      id: 3,
      name: "Dr. Robert Garcia",
      specialty: "Pediatrics",
      experience: "10 years",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Garcia provides comprehensive pediatric care with a special interest in childhood development and preventive medicine.",
    },
    {
      id: 4,
      name: "Dr. Sarah Johnson",
      specialty: "Dermatology",
      experience: "8 years",
      rating: 4.9,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Johnson specializes in medical and cosmetic dermatology, treating a wide range of skin conditions.",
    },
    {
      id: 5,
      name: "Dr. James Wilson",
      specialty: "Orthopedics",
      experience: "20 years",
      rating: 4.8,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Wilson is an orthopedic surgeon with expertise in joint replacement and sports medicine.",
    },
    {
      id: 6,
      name: "Dr. Lisa Martinez",
      specialty: "Psychiatry",
      experience: "14 years",
      rating: 4.7,
      image: "/placeholder.svg?height=200&width=200",
      bio: "Dr. Martinez provides compassionate mental health care with a focus on anxiety, depression, and PTSD.",
    },
  ]

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
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="/doctors" className="text-sm font-medium transition-colors hover:text-primary font-bold">
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
                  Our Healthcare Providers
                </h1>
                <p className="max-w-[800px] text-muted-foreground md:text-xl">
                  Meet our team of experienced and dedicated healthcare professionals
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={doctor.image || "/placeholder.svg"}
                      alt={`Dr. ${doctor.name}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{doctor.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{doctor.specialty}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{doctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{doctor.rating}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{doctor.bio}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                      <Button size="sm" className="w-full">
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
