import { type NextRequest, NextResponse } from "next/server"
import type { Feedback } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { userId, category, message, sentiment } = await request.json()

    if (!userId || !category || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock feedback storage - replace with actual database
    const feedback: Feedback = {
      id: `feedback_${Date.now()}`,
      userId,
      category,
      message,
      sentiment: sentiment || "neutral",
      createdAt: new Date(),
      resolved: false,
    }

    // In a real app, save to database here
    console.log("Feedback received:", feedback)

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
