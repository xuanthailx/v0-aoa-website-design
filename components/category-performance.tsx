"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryData {
  category: string
  accuracy: number
  queries: number
}

interface CategoryPerformanceProps {
  data: CategoryData[]
}

export function CategoryPerformance({ data }: CategoryPerformanceProps) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Performance by Category</CardTitle>
        <CardDescription>Accuracy and query volume by document category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="category" stroke="var(--color-muted-foreground)" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="var(--color-muted-foreground)" yAxisId="left" />
            <YAxis stroke="var(--color-muted-foreground)" yAxisId="right" orientation="right" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Bar yAxisId="left" dataKey="accuracy" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="queries" fill="var(--color-primary)" opacity={0.5} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
