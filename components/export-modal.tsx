"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { exportToCSV, exportToJSON, exportToPDF, generateAnalyticsReport } from "@/lib/export-utils"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
  filename: string
  reportType?: "analytics" | "feedback" | "dashboard"
}

export function ExportModal({ isOpen, onClose, data, filename, reportType = "analytics" }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"csv" | "json" | "pdf">("csv")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      if (selectedFormat === "csv") {
        const csvData = Array.isArray(data) ? data : [data]
        exportToCSV(csvData, filename)
      } else if (selectedFormat === "json") {
        exportToJSON(data, filename)
      } else if (selectedFormat === "pdf") {
        const report = generateAnalyticsReport(data)
        exportToPDF(report, filename)
      }
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border border-border">
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
          <CardDescription>Choose your preferred export format</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {(["csv", "json", "pdf"] as const).map((format) => (
              <label
                key={format}
                className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface"
              >
                <input
                  type="radio"
                  name="format"
                  value={format}
                  checked={selectedFormat === format}
                  onChange={(e) => setSelectedFormat(e.target.value as "csv" | "json" | "pdf")}
                  className="w-4 h-4"
                />
                <div>
                  <p className="font-medium text-foreground capitalize">{format}</p>
                  <p className="text-sm text-muted-foreground">
                    {format === "csv" && "Spreadsheet format"}
                    {format === "json" && "Machine-readable format"}
                    {format === "pdf" && "Document format"}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting} className="flex-1">
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
