"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"
import type { Feedback } from "@/lib/types"

interface FeedbackModalProps {
  onSubmit: (feedback: Omit<Feedback, "id" | "createdAt">) => Promise<void>
  isLoading?: boolean
}

export function FeedbackModal({ onSubmit, isLoading = false }: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<"bug" | "suggestion" | "feature_request">("suggestion")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    { id: "bug", label: "Bug Report", icon: "🐞", description: "Wrong or unclear answer" },
    { id: "suggestion", label: "Suggestion", icon: "💡", description: "Improvement idea" },
    { id: "feature_request", label: "Feature Request", icon: "✨", description: "New feature idea" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        userId: "current_user",
        category: category as "bug" | "suggestion" | "feature_request",
        message,
        sentiment: "neutral",
      })
      setSubmitted(true)
      setTimeout(() => {
        setMessage("")
        setCategory("suggestion")
        setSubmitted(false)
        setIsOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center z-40"
        title="Send feedback"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setIsOpen(false)} />}

      {/* Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 z-50 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border border-border shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Send Feedback</CardTitle>
                <CardDescription>Help us improve OnboardAI</CardDescription>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✓</div>
                  <p className="text-sm font-medium text-foreground mb-1">Thank you!</p>
                  <p className="text-xs text-muted-foreground">Your feedback has been received.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <div className="grid grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id as "bug" | "suggestion" | "feature_request")}
                          className={`p-3 rounded-lg border-2 transition text-center ${
                            category === cat.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="text-xl mb-1">{cat.icon}</div>
                          <div className="text-xs font-medium text-foreground">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what you think..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={!message.trim() || isSubmitting || isLoading}>
                    {isSubmitting ? "Sending..." : "Send Feedback"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
