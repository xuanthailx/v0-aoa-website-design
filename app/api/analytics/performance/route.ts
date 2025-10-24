import { NextResponse } from "next/server"

export async function GET() {
  try {
    const performanceData = {
      overallAccuracy: 0.87,
      averageResponseTime: 1240,
      totalQueries: 2847,
      successRate: 0.92,
      timeSeriesData: [
        { date: "Mon", accuracy: 0.82, responseTime: 1200, queries: 120 },
        { date: "Tue", accuracy: 0.85, responseTime: 1150, queries: 145 },
        { date: "Wed", accuracy: 0.88, responseTime: 1300, queries: 168 },
        { date: "Thu", accuracy: 0.86, responseTime: 1250, queries: 152 },
        { date: "Fri", accuracy: 0.89, responseTime: 1100, queries: 198 },
        { date: "Sat", accuracy: 0.87, responseTime: 1280, queries: 134 },
        { date: "Sun", accuracy: 0.84, responseTime: 1350, queries: 98 },
      ],
      categoryPerformance: [
        { category: "Setup Guide", accuracy: 0.91, queries: 456 },
        { category: "API Docs", accuracy: 0.88, queries: 623 },
        { category: "Git Workflow", accuracy: 0.85, queries: 234 },
        { category: "Testing", accuracy: 0.89, queries: 512 },
        { category: "Business", accuracy: 0.82, queries: 178 },
      ],
      topQuestions: [
        { question: "How do I set up the development environment?", frequency: 234, satisfaction: 0.94 },
        { question: "What are the API rate limits?", frequency: 189, satisfaction: 0.91 },
        { question: "How do I create a feature branch?", frequency: 156, satisfaction: 0.88 },
        { question: "What testing frameworks are recommended?", frequency: 142, satisfaction: 0.86 },
        { question: "How do I deploy to production?", frequency: 128, satisfaction: 0.89 },
      ],
      userSatisfaction: [
        { rating: 5, count: 1240, percentage: 43.6 },
        { rating: 4, count: 980, percentage: 34.5 },
        { rating: 3, count: 420, percentage: 14.8 },
        { rating: 2, count: 140, percentage: 4.9 },
        { rating: 1, count: 67, percentage: 2.2 },
      ],
    }

    return NextResponse.json(performanceData)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
