export interface ExportOptions {
  format: "csv" | "json" | "pdf"
  includeCharts: boolean
  dateRange: string
}

export function exportToCSV(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csvContent = [
    headers.join(","),
    ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || "")).join(",")),
  ].join("\n")

  const element = document.createElement("a")
  element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent))
  element.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.csv`)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  const element = document.createElement("a")
  element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(jsonContent))
  element.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.json`)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function exportToPDF(content: string, filename: string) {
  // Mock PDF export - in production, use a library like jsPDF
  const element = document.createElement("a")
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content))
  element.setAttribute("download", `${filename}-${new Date().toISOString().split("T")[0]}.txt`)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export function generateAnalyticsReport(data: any): string {
  return `
OnboardAI Analytics Report
Generated: ${new Date().toLocaleString()}

Summary:
- Total Queries: ${data.totalQueries}
- Average Satisfaction: ${data.avgSatisfaction}%
- Documents Processed: ${data.documentsProcessed}
- Active Users: ${data.activeUsers}

Performance Metrics:
- System Uptime: ${data.uptime}%
- Average Response Time: ${data.avgResponseTime}ms
- Success Rate: ${data.successRate}%

Top Questions:
${data.topQuestions.map((q: any, i: number) => `${i + 1}. ${q.question} (${q.count} times)`).join("\n")}

Report End
  `.trim()
}
