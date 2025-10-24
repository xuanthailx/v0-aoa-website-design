import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { documentId, rejectionReason, rejectedBy } = await request.json()

    if (!documentId || !rejectionReason || !rejectedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock rejection - replace with actual database update
    return NextResponse.json({
      success: true,
      message: "Document rejected successfully",
      documentId,
    })
  } catch (error) {
    console.error("Document rejection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
