"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { CheckCircle2, Circle, Trash2 } from "lucide-react"
import type { Feedback } from "@/lib/types"

export default function FeedbackReportsPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "bug" | "suggestion" | "feature_request">("all")

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch("/api/feedback/list")
        if (response.ok) {
          const data = await response.json()
          setFeedbacks(data)
        }
      } catch (error) {
        console.error("Failed to fetch feedbacks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  const filteredFeedbacks = feedbacks.filter((f) => filter === "all" || f.category === filter)

  const stats = [
    { label: "Total Feedback", value: feedbacks.length },
    { label: "Bug Reports", value: feedbacks.filter((f) => f.category === "bug").length },
    { label: "Suggestions", value: feedbacks.filter((f) => f.category === "suggestion").length },
    { label: "Feature Requests", value: feedbacks.filter((f) => f.category === "feature_request").length },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "bug":
        return "bg-red-500/10 text-red-700"
      case "suggestion":
        return "bg-blue-500/10 text-blue-700"
      case "feature_request":
        return "bg-green-500/10 text-green-700"
      default:
        return "bg-gray-500/10 text-gray-700"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "bug":
        return "Bug Report"
      case "suggestion":
        return "Suggestion"
      case "feature_request":
        return "Feature Request"
      default:
        return category
    }
  }

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Feedback Reports</h1>
            <p className="text-muted-foreground">Review and manage user feedback to improve OnboardAI.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Buttons */}
          <div className="mb-8 flex gap-2 flex-wrap">
            {(["all", "bug", "suggestion", "feature_request"] as const).map((cat) => (
              <Button
                key={cat}
                variant={filter === cat ? "default" : "outline"}
                onClick={() => setFilter(cat)}
                className={filter === cat ? "" : "bg-transparent"}
              >
                {cat === "all" ? "All Feedback" : getCategoryLabel(cat)}
              </Button>
            ))}
          </div>

          {/* Feedback List */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Feedback Items</CardTitle>
              <CardDescription>Total: {filteredFeedbacks.length}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading feedback...</p>
                </div>
              ) : filteredFeedbacks.length > 0 ? (
                <div className="space-y-4">
                  {filteredFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {feedback.resolved ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(feedback.category)}`}
                              >
                                {getCategoryLabel(feedback.category)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {feedback.createdAt instanceof Date
                                  ? feedback.createdAt.toLocaleDateString()
                                  : new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{feedback.message}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No feedback found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
