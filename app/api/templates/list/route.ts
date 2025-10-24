import { NextResponse } from "next/server"
import type { DocumentTemplate } from "@/lib/types"

export async function GET() {
  try {
    const templates: DocumentTemplate[] = [
      {
        id: "template_1",
        name: "Setup Guide",
        description: "Step-by-step guide for setting up the project",
        category: "setup_guide",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "template_2",
        name: "API Documentation",
        description: "Complete API reference and endpoints",
        category: "api_docs",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "template_3",
        name: "Git Workflow",
        description: "Git branching and commit guidelines",
        category: "git_workflow",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "template_4",
        name: "Testing Checklist",
        description: "Testing procedures and quality assurance",
        category: "testing_checklist",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
      {
        id: "template_5",
        name: "Business Overview",
        description: "Company mission, values, and business model",
        category: "business_overview",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ]

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Templates list error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
