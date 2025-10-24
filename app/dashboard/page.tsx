"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { ExportModal } from "@/components/export-modal"
import { Download } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const performanceData = [
  { date: "Mon", queries: 24, satisfaction: 85 },
  { date: "Tue", queries: 32, satisfaction: 88 },
  { date: "Wed", queries: 28, satisfaction: 82 },
  { date: "Thu", queries: 35, satisfaction: 90 },
  { date: "Fri", queries: 42, satisfaction: 87 },
  { date: "Sat", queries: 18, satisfaction: 91 },
  { date: "Sun", queries: 15, satisfaction: 89 },
]

const satisfactionData = [
  { name: "Very Satisfied", value: 45, color: "#1E88E5" },
  { name: "Satisfied", value: 35, color: "#42A5F5" },
  { name: "Neutral", value: 15, color: "#90CAF9" },
  { name: "Unsatisfied", value: 5, color: "#BBDEFB" },
]

const topQuestions = [
  { question: "How do I reset my password?", count: 24, satisfaction: 92 },
  { question: "What are the system requirements?", count: 18, satisfaction: 88 },
  { question: "How do I export data?", count: 15, satisfaction: 85 },
  { question: "Can I integrate with Slack?", count: 12, satisfaction: 80 },
  { question: "How do I manage team members?", count: 10, satisfaction: 87 },
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("week")
  const [showExportModal, setShowExportModal] = useState(false)

  const dashboardData = {
    totalQueries: 154,
    avgSatisfaction: 87,
    documentsUsed: 12,
    feedbackGiven: 23,
    performanceData,
    satisfactionData,
    topQuestions,
  }

  return (
    <ProtectedRoute requiredRoles={["developer", "document_manager"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header with Export Button */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">View your personal usage statistics and feedback results</p>
            </div>
            <Button onClick={() => setShowExportModal(true)} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-8">
            {["day", "week", "month"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">154</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">87%</div>
                <p className="text-xs text-muted-foreground mt-1">Based on your feedback</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Documents Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">12</div>
                <p className="text-xs text-muted-foreground mt-1">Active documents</p>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Feedback Given</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">23</div>
                <p className="text-xs text-muted-foreground mt-1">Helping improve AI</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Query Trends */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Query Trends</CardTitle>
                <CardDescription>Your queries and satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="queries"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ fill: "var(--primary)" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      dot={{ fill: "var(--accent)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction Distribution */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Satisfaction Distribution</CardTitle>
                <CardDescription>How satisfied you are with responses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={satisfactionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {satisfactionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Questions */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Your Top Questions</CardTitle>
              <CardDescription>Most frequently asked questions and their satisfaction ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topQuestions.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.question}</p>
                      <p className="text-sm text-muted-foreground">{item.count} times asked</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{item.satisfaction}%</div>
                      <p className="text-xs text-muted-foreground">satisfaction</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> This dashboard shows only your personal usage statistics and feedback results. For
              system-wide analytics and AI performance insights, contact your administrator.
            </p>
          </div>
        </main>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          data={dashboardData}
          filename="dashboard-report"
          reportType="dashboard"
        />
      </div>
    </ProtectedRoute>
  )
}
