import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { documentId, approvedBy } = await request.json()

    if (!documentId || !approvedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock approval - replace with actual database update
    return NextResponse.json({
      success: true,
      message: "Document approved successfully",
      documentId,
    })
  } catch (error) {
    console.error("Document approval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
