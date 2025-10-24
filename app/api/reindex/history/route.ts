import { NextResponse } from "next/server"
import type { ReindexJob } from "@/lib/types"

export async function GET() {
  try {
    const jobs: ReindexJob[] = [
      {
        id: "reindex_1",
        status: "completed",
        startedAt: new Date(Date.now() - 86400000),
        completedAt: new Date(Date.now() - 82800000),
        progress: 100,
        totalDocuments: 42,
        processedDocuments: 42,
        failedDocuments: 0,
        initiatedBy: "user_1",
      },
      {
        id: "reindex_2",
        status: "completed",
        startedAt: new Date(Date.now() - 172800000),
        completedAt: new Date(Date.now() - 169200000),
        progress: 100,
        totalDocuments: 38,
        processedDocuments: 38,
        failedDocuments: 0,
        initiatedBy: "user_2",
      },
      {
        id: "reindex_3",
        status: "failed",
        startedAt: new Date(Date.now() - 259200000),
        completedAt: new Date(Date.now() - 255600000),
        progress: 45,
        totalDocuments: 42,
        processedDocuments: 19,
        failedDocuments: 3,
        errorMessage: "Database connection timeout",
        initiatedBy: "user_1",
      },
    ]

    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Reindex history error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
