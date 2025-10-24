"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { PerformanceChart } from "@/components/performance-chart"
import { CategoryPerformance } from "@/components/category-performance"
import { SatisfactionGauge } from "@/components/satisfaction-gauge"
import { ExportModal } from "@/components/export-modal"
import { TrendingUp, Zap, MessageSquare, ThumbsUp, Download } from "lucide-react"

interface AnalyticsData {
  overallAccuracy: number
  averageResponseTime: number
  totalQueries: number
  successRate: number
  timeSeriesData: Array<{
    date: string
    accuracy: number
    responseTime: number
    queries: number
  }>
  categoryPerformance: Array<{
    category: string
    accuracy: number
    queries: number
  }>
  topQuestions: Array<{
    question: string
    frequency: number
    satisfaction: number
  }>
  userSatisfaction: Array<{
    rating: number
    count: number
    percentage: number
  }>
}

export default function InsightsDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showExportModal, setShowExportModal] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/performance")
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (isLoading) {
    return (
      <ProtectedRoute requiredRoles={["admin"]}>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-muted-foreground">Loading analytics...</p>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (!analytics) {
    return (
      <ProtectedRoute requiredRoles={["admin"]}>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-muted-foreground">Failed to load analytics.</p>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header with Export Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">AI Performance Insights</h1>
              <p className="text-muted-foreground">Monitor and analyze AI assistant performance metrics.</p>
            </div>
            <Button onClick={() => setShowExportModal(true)} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Overall Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{(analytics.overallAccuracy * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Based on user feedback</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Avg Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{analytics.averageResponseTime}ms</p>
                <p className="text-xs text-muted-foreground mt-1">Average latency</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Total Queries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{analytics.totalQueries.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{(analytics.successRate * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Successful responses</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="space-y-8">
            <PerformanceChart data={analytics.timeSeriesData} />

            <div className="grid lg:grid-cols-2 gap-8">
              <CategoryPerformance data={analytics.categoryPerformance} />
              <SatisfactionGauge data={analytics.userSatisfaction} />
            </div>

            {/* Top Questions */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Top Questions</CardTitle>
                <CardDescription>Most frequently asked questions and satisfaction ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topQuestions.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/50 transition">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-foreground text-sm">{item.question}</p>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {item.frequency}x
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${item.satisfaction * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {(item.satisfaction * 100).toFixed(0)}% satisfaction
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={analytics}
          filename="analytics-report"
          reportType="analytics"
        />
      </div>
    </ProtectedRoute>
  )
}
