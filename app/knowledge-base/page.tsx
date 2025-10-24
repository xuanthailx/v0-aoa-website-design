"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { useAuth } from "@/lib/auth-context"
import { canPerformAction } from "@/lib/rbac"
import { RefreshCw, Upload, FileText, CheckCircle2, XCircle, Clock } from "lucide-react"
import { DocumentPreviewDrawer } from "@/components/document-preview-drawer"
import { TemplateManager } from "@/components/template-manager"
import { ReindexProgressModal } from "@/components/reindex-progress-modal"
import { ReindexHistory } from "@/components/reindex-history"
import type { Document, DocumentTemplate, ReindexJob } from "@/lib/types"

export default function KnowledgeBasePage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reindexJob, setReindexJob] = useState<ReindexJob | null>(null)
  const [showReindexModal, setShowReindexModal] = useState(false)
  const [isReindexing, setIsReindexing] = useState(false)

  const articles = [
    {
      id: "1",
      title: "Getting Started with OnboardAI",
      description: "Learn the basics of uploading documents and using the chat interface.",
      category: "getting-started",
      views: 1240,
    },
    {
      id: "2",
      title: "Document Upload Best Practices",
      description: "Tips and tricks for uploading documents in various formats.",
      category: "documents",
      views: 856,
    },
    {
      id: "3",
      title: "Understanding AI Responses",
      description: "How the AI assistant processes your documents and generates answers.",
      category: "ai",
      views: 642,
    },
    {
      id: "4",
      title: "Managing Your Knowledge Base",
      description: "Organize and maintain your documents for better search results.",
      category: "documents",
      views: 523,
    },
    {
      id: "5",
      title: "Advanced Search Techniques",
      description: "Master the search functionality to find exactly what you need.",
      category: "search",
      views: 789,
    },
    {
      id: "6",
      title: "Troubleshooting Common Issues",
      description: "Solutions to frequently encountered problems and how to resolve them.",
      category: "support",
      views: 1105,
    },
  ]

  const categories = [
    { id: "all", label: "All Articles" },
    { id: "getting-started", label: "Getting Started" },
    { id: "documents", label: "Documents" },
    { id: "ai", label: "AI Features" },
    { id: "search", label: "Search" },
    { id: "support", label: "Support" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, templatesRes] = await Promise.all([fetch("/api/documents/list"), fetch("/api/templates/list")])

        if (docsRes.ok) {
          const docsData = await docsRes.json()
          setDocuments(docsData)
        }

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json()
          setTemplates(templatesData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const canUpload = user && canPerformAction(user.role, "kb:upload_document")
  const canReindex = user && canPerformAction(user.role, "kb:reindex")
  const canApprove = user && canPerformAction(user.role, "kb:approve_document")

  const handleReindex = async () => {
    if (!user || isReindexing) return

    setIsReindexing(true)
    try {
      const response = await fetch("/api/reindex/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        const job = await response.json()
        setReindexJob(job)
        setShowReindexModal(true)
      }
    } catch (error) {
      console.error("Failed to start reindex:", error)
    } finally {
      setIsReindexing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return null
    }
  }

  const handleApprove = async (documentId: string) => {
    try {
      const response = await fetch("/api/documents/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, approvedBy: user?.id }),
      })

      if (response.ok) {
        setDocuments((prev) =>
          prev.map((doc) => (doc.id === documentId ? { ...doc, status: "approved" as const } : doc)),
        )
      }
    } catch (error) {
      console.error("Failed to approve document:", error)
    }
  }

  const handleReject = async (documentId: string, reason: string) => {
    try {
      const response = await fetch("/api/documents/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, rejectionReason: reason, rejectedBy: user?.id }),
      })

      if (response.ok) {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? { ...doc, status: "rejected" as const, rejectionReason: reason } : doc,
          ),
        )
      }
    } catch (error) {
      console.error("Failed to reject document:", error)
    }
  }

  return (
    <ProtectedRoute requiredRoles={["admin", "developer", "document_manager"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-foreground">Knowledge Base</h1>
              <div className="flex gap-2">
                {canReindex && (
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={handleReindex}
                    disabled={isReindexing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isReindexing ? "animate-spin" : ""}`} />
                    {isReindexing ? "Re-indexing..." : "Re-index"}
                  </Button>
                )}
                {canUpload && (
                  <Button className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                  </Button>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers, learn best practices, and get the most out of OnboardAI.
            </p>

            {/* Search */}
            <div className="relative mb-8">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-input border-border text-base py-6"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "" : "bg-transparent"}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="border border-border hover:border-primary/50 transition cursor-pointer group"
                >
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{article.views.toLocaleString()} views</span>
                      <span className="text-primary font-medium">Read →</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No articles found matching your search.</p>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="space-y-8">
            {/* Template Manager (Admin Only) */}
            {canApprove && <TemplateManager templates={templates} />}

            {/* Documents Table */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>Total: {documents.length}</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading documents...</p>
                  </div>
                ) : documents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-foreground">Title</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Uploaded By</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Date</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc.id} className="border-b border-border hover:bg-muted/50 transition">
                            <td className="py-3 px-4 text-foreground flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {doc.title}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{doc.uploadedByName}</td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {doc.createdAt.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(doc.status)}
                                <span className="text-sm font-medium capitalize">{doc.status}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(doc)}>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No documents uploaded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Re-index History */}
            {canReindex && <ReindexHistory />}
          </div>
        </main>

        {/* Document Preview Drawer */}
        <DocumentPreviewDrawer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          canApprove={canApprove}
        />

        {/* Re-index Progress Modal */}
        <ReindexProgressModal job={reindexJob} onClose={() => setShowReindexModal(false)} />
      </div>
    </ProtectedRoute>
  )
}
