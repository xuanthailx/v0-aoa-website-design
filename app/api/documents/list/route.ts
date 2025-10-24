import { NextResponse } from "next/server"
import type { Document } from "@/lib/types"

export async function GET() {
  try {
    const documents: Document[] = [
      {
        id: "doc_1",
        title: "Project Setup Guide",
        templateId: "template_1",
        uploadedBy: "user_2",
        uploadedByName: "Jane Smith",
        content: "Complete setup instructions...",
        status: "approved",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-02"),
        approvedBy: "user_1",
      },
      {
        id: "doc_2",
        title: "REST API Reference",
        templateId: "template_2",
        uploadedBy: "user_3",
        uploadedByName: "Bob Johnson",
        content: "API endpoints documentation...",
        status: "pending",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
      {
        id: "doc_3",
        title: "Git Workflow Guidelines",
        templateId: "template_3",
        uploadedBy: "user_2",
        uploadedByName: "Jane Smith",
        content: "Branch naming and commit conventions...",
        status: "approved",
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-02-16"),
        approvedBy: "user_1",
      },
      {
        id: "doc_4",
        title: "QA Testing Procedures",
        templateId: "template_4",
        uploadedBy: "user_4",
        uploadedByName: "Alice Brown",
        content: "Testing checklist and procedures...",
        status: "rejected",
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-06"),
        rejectionReason: "Missing test coverage details",
      },
    ]

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Documents list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
