"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Clock, X } from "lucide-react"
import type { ReindexJob } from "@/lib/types"

interface ReindexProgressModalProps {
  job: ReindexJob | null
  onClose: () => void
}

export function ReindexProgressModal({ job, onClose }: ReindexProgressModalProps) {
  const [currentJob, setCurrentJob] = useState<ReindexJob | null>(job)
  const [isPolling, setIsPolling] = useState(false)

  useEffect(() => {
    if (!job || job.status === "completed" || job.status === "failed") {
      setIsPolling(false)
      return
    }

    setIsPolling(true)
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/reindex/status?jobId=${job.id}`)
        if (response.ok) {
          const updatedJob = await response.json()
          setCurrentJob(updatedJob)

          if (updatedJob.status === "completed" || updatedJob.status === "failed") {
            setIsPolling(false)
          }
        }
      } catch (error) {
        console.error("Failed to fetch job status:", error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [job])

  if (!currentJob) return null

  const isComplete = currentJob.status === "completed"
  const isFailed = currentJob.status === "failed"
  const isInProgress = currentJob.status === "in_progress"

  const duration = currentJob.completedAt
    ? Math.round((currentJob.completedAt.getTime() - currentJob.startedAt.getTime()) / 1000)
    : Math.round((Date.now() - currentJob.startedAt.getTime()) / 1000)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-border shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Re-indexing Documents</CardTitle>
            <CardDescription>Processing your knowledge base</CardDescription>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Icon */}
          <div className="flex justify-center">
            {isComplete && <CheckCircle2 className="h-12 w-12 text-green-600" />}
            {isFailed && <AlertCircle className="h-12 w-12 text-red-600" />}
            {isInProgress && (
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            )}
          </div>

          {/* Status Text */}
          <div className="text-center">
            <p className="font-semibold text-foreground capitalize">{currentJob.status.replace("_", " ")}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {duration}s {isInProgress ? "elapsed" : "total"}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm font-semibold text-primary">{currentJob.progress}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${currentJob.progress}%` }}
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{currentJob.processedDocuments}</p>
              <p className="text-xs text-muted-foreground mt-1">Processed</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{currentJob.totalDocuments}</p>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-red-600">{currentJob.failedDocuments}</p>
              <p className="text-xs text-muted-foreground mt-1">Failed</p>
            </div>
          </div>

          {/* Error Message */}
          {isFailed && currentJob.errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50">
              <p className="text-sm text-destructive">{currentJob.errorMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {isComplete || isFailed ? (
              <Button className="w-full" onClick={onClose}>
                Close
              </Button>
            ) : (
              <Button variant="outline" className="w-full bg-transparent" disabled>
                <Clock className="h-4 w-4 mr-2" />
                In Progress...
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
