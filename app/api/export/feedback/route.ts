import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { format, dateRange } = await request.json()

    // Mock feedback data - in production, fetch from database
    const feedbackData = [
      {
        id: 1,
        date: "2024-01-15",
        category: "Bug Report",
        message: "Search not working properly",
        sentiment: "negative",
        resolved: false,
      },
      {
        id: 2,
        date: "2024-01-14",
        category: "Suggestion",
        message: "Add dark mode support",
        sentiment: "neutral",
        resolved: true,
      },
      {
        id: 3,
        date: "2024-01-13",
        category: "Feature Request",
        message: "Export to PDF functionality",
        sentiment: "positive",
        resolved: false,
      },
    ]

    return NextResponse.json({
      success: true,
      data: feedbackData,
      format,
      dateRange,
    })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
