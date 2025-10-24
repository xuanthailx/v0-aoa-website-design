import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json()

    // Mock Google OAuth URL - in production, use actual Google OAuth
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback&response_type=code&scope=openid%20email%20profile&state=${role}`

    return NextResponse.json({
      authUrl,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate Google SSO" }, { status: 500 })
  }
}
