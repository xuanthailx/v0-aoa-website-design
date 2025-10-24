import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Mock implementation - in production, send actual email
    const resetToken = Math.random().toString(36).substring(2, 15)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Store token in database (mock)
    console.log(`Password reset link sent to ${email}: ${resetToken}`)

    return NextResponse.json({
      success: true,
      message: "Password reset link sent to email",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reset email" }, { status: 500 })
  }
}
