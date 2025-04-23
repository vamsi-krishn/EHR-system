import { type NextRequest, NextResponse } from "next/server"

// Mock database of users - this will be replaced by our blockchain.ts global state
const mockUsers = {
  "0x1234567890abcdef1234567890abcdef12345678": {
    role: "patient",
    name: "John Smith",
    id: "1",
  },
  "0x2345678901abcdef2345678901abcdef23456789": {
    role: "patient",
    name: "Sarah Johnson",
    id: "2",
  },
  "0x3456789012abcdef3456789012abcdef34567890": {
    role: "doctor",
    name: "Dr. Michael Chen",
    id: "1",
  },
  "0x4567890123abcdef4567890123abcdef45678901": {
    role: "doctor",
    name: "Dr. Emily Williams",
    id: "2",
  },
  "0x5678901234abcdef5678901234abcdef56789012": {
    role: "doctor",
    name: "Dr. Robert Garcia",
    id: "3",
  },
  "0x9876543210fedcba9876543210fedcba98765432": {
    role: "admin",
    name: "Admin User",
    id: "1",
  },
}

// Import the checkRegistration function from blockchain.ts
import { checkRegistration } from "@/lib/blockchain"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")?.toLowerCase()

  if (!address) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  try {
    // Check if the address is registered using our blockchain function
    const registrationStatus = await checkRegistration(address)

    if (!registrationStatus.isRegistered) {
      // Check the static mockUsers as a fallback
      const user = mockUsers[address]

      if (!user) {
        return NextResponse.json(
          {
            error: "Wallet not registered. Please register first.",
            isRegistered: false,
          },
          { status: 404 },
        )
      }

      return NextResponse.json({
        isRegistered: true,
        role: user.role,
        name: user.name,
        id: user.id,
      })
    }

    return NextResponse.json({
      isRegistered: true,
      role: registrationStatus.role,
      name: registrationStatus.name,
      id: registrationStatus.id,
    })
  } catch (error) {
    console.error("Error checking registration:", error)
    return NextResponse.json({ error: "Failed to check registration status" }, { status: 500 })
  }
}
