import { type NextRequest, NextResponse } from "next/server"
import type { User } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    // Mock authentication - replace with real auth logic
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Create mock user
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: email.split("@")[0],
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
