"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SatisfactionData {
  rating: number
  count: number
  percentage: number
}

interface SatisfactionGaugeProps {
  data: SatisfactionData[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#dc2626"]

export function SatisfactionGauge({ data }: SatisfactionGaugeProps) {
  const chartData = data.map((item) => ({
    name: `${item.rating} Star${item.rating !== 1 ? "s" : ""}`,
    value: item.count,
  }))

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>User Satisfaction</CardTitle>
        <CardDescription>Distribution of user ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Breakdown */}
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.rating} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {item.rating} Star{item.rating !== 1 ? "s" : ""}
                  </span>
                  <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{item.count} ratings</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
