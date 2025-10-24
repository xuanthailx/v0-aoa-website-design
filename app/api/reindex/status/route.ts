import { NextResponse } from "next/server"
import type { ReindexJob } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 })
    }

    // Mock job status - in a real app, fetch from database
    const mockJobs: Record<string, ReindexJob> = {
      reindex_1: {
        id: "reindex_1",
        status: "completed",
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(Date.now() - 1800000),
        progress: 100,
        totalDocuments: 42,
        processedDocuments: 42,
        failedDocuments: 0,
        initiatedBy: "user_1",
      },
      reindex_2: {
        id: "reindex_2",
        status: "in_progress",
        startedAt: new Date(Date.now() - 600000),
        progress: 65,
        totalDocuments: 42,
        processedDocuments: 27,
        failedDocuments: 1,
        initiatedBy: "user_1",
      },
    }

    const job = mockJobs[jobId]

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error("Reindex status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
