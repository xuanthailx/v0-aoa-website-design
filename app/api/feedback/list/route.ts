import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock feedback list - replace with actual database query
    const feedbacks = [
      {
        id: "feedback_1",
        userId: "user_1",
        category: "bug",
        message: "Chat sometimes shows duplicate messages",
        sentiment: "negative",
        createdAt: new Date(Date.now() - 86400000),
        resolved: false,
      },
      {
        id: "feedback_2",
        userId: "user_2",
        category: "suggestion",
        message: "Would be great to have dark mode",
        sentiment: "neutral",
        createdAt: new Date(Date.now() - 172800000),
        resolved: false,
      },
      {
        id: "feedback_3",
        userId: "user_3",
        category: "feature_request",
        message: "Add export to PDF feature",
        sentiment: "positive",
        createdAt: new Date(Date.now() - 259200000),
        resolved: true,
      },
    ]

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error("Feedback list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
