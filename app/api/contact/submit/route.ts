import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Mock contact submission - replace with actual email service
    const contactData = {
      id: `contact_${Date.now()}`,
      name,
      email,
      subject,
      message,
      submittedAt: new Date(),
    }

    console.log("Contact form submitted:", contactData)

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us. We'll get back to you soon!",
      contactId: contactData.id,
    })
  } catch (error) {
    console.error("Contact submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
