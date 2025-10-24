"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { Download } from "lucide-react"

export default function AnalyticsDashboard() {
  const chartData = [
    { month: "Jan", documents: 45, queries: 120, users: 24 },
    { month: "Feb", documents: 52, queries: 145, users: 28 },
    { month: "Mar", documents: 48, queries: 138, users: 26 },
    { month: "Apr", documents: 61, queries: 165, users: 32 },
    { month: "May", documents: 55, queries: 152, users: 29 },
    { month: "Jun", documents: 67, queries: 178, users: 35 },
  ]

  const stats = [
    { label: "Total Documents", value: "328", change: "+12%" },
    { label: "Total Queries", value: "2,847", change: "+18%" },
    { label: "Active Users", value: "156", change: "+8%" },
    { label: "Avg. Response Time", value: "1.2s", change: "-5%" },
  ]

  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <div className="min-h-screen bg-background">
        <AppHeader />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your usage, engagement, and system performance.</p>
            </div>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <Card key={i} className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-primary font-medium mt-1">{stat.change} from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Line Chart */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Documents & Queries Trend</CardTitle>
                <CardDescription>Monthly activity over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="documents" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="queries" stroke="var(--color-secondary)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border border-border">
              <CardHeader>
                <CardTitle>Active Users Growth</CardTitle>
                <CardDescription>User growth over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="users" fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Top Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Onboarding Guide.pdf", views: 342 },
                    { name: "Company Handbook.docx", views: 298 },
                    { name: "Policy Manual.pdf", views: 215 },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground truncate">{doc.name}</span>
                      <span className="text-muted-foreground font-medium">{doc.views}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">Query Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: "Information Lookup", count: 1240 },
                    { type: "Clarification", count: 856 },
                    { type: "Summarization", count: 751 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.type}</span>
                      <span className="text-muted-foreground font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader>
                <CardTitle className="text-lg">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { metric: "Uptime", value: "99.9%" },
                    { metric: "Avg Response", value: "1.2s" },
                    { metric: "Error Rate", value: "0.1%" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.metric}</span>
                      <span className="text-primary font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
