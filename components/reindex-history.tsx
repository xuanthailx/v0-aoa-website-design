"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import type { ReindexJob } from "@/lib/types"

export function ReindexHistory() {
  const [jobs, setJobs] = useState<ReindexJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/reindex/history")
        if (response.ok) {
          const data = await response.json()
          setJobs(data)
        }
      } catch (error) {
        console.error("Failed to fetch reindex history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "failed":
        return "text-red-600"
      case "in_progress":
        return "text-blue-600"
      default:
        return "text-yellow-600"
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Re-index History</CardTitle>
        <CardDescription>Recent document re-indexing operations</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="font-medium text-foreground capitalize">{job.status.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.startedAt.toLocaleDateString()} at {job.startedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getStatusColor(job.status)}`}>{job.progress}%</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Processed</p>
                    <p className="font-semibold text-foreground">
                      {job.processedDocuments}/{job.totalDocuments}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Failed</p>
                    <p className="font-semibold text-foreground">{job.failedDocuments}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">
                      {job.completedAt ? Math.round((job.completedAt.getTime() - job.startedAt.getTime()) / 1000) : "—"}
                      s
                    </p>
                  </div>
                </div>

                {job.errorMessage && (
                  <div className="mt-3 p-2 rounded bg-destructive/10 border border-destructive/50">
                    <p className="text-xs text-destructive">{job.errorMessage}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No re-index operations yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
