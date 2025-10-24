"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { FeedbackModal } from "@/components/feedback-modal"
import { MessageWithCitations } from "@/components/message-with-citations"
import { ChatHistorySidebar } from "@/components/chat-history-sidebar"
import type { Feedback } from "@/lib/types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  citations?: Array<{
    id: string
    title: string
    source: string
    relevance: number
  }>
  isStreaming?: boolean
}

interface ChatSession {
  id: string
  title: string
  createdAt: Date
  messageCount: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. Upload a document to get started, or ask me anything about your documents.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "session_1",
      title: "Getting Started",
      createdAt: new Date(Date.now() - 86400000),
      messageCount: 12,
    },
    {
      id: "session_2",
      title: "API Documentation",
      createdAt: new Date(Date.now() - 172800000),
      messageCount: 8,
    },
  ])
  const [currentSessionId, setCurrentSessionId] = useState("session_1")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate streaming response
    const assistantId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      isStreaming: true,
      citations: [
        {
          id: "cite_1",
          title: "Onboarding Guide.pdf",
          source: "Setup Guide Template",
          relevance: 0.95,
        },
        {
          id: "cite_2",
          title: "Company Handbook.docx",
          source: "Business Overview",
          relevance: 0.78,
        },
      ],
    }

    setMessages((prev) => [...prev, assistantMessage])

    // Simulate streaming text
    const fullResponse =
      "Based on your documents, here's what I found: The onboarding process typically takes 2-3 weeks and involves several key steps. First, new team members should review the company handbook to understand our values and culture. Then, they should follow the setup guide to configure their development environment. Finally, they should complete the testing checklist to ensure everything is working correctly."

    let currentText = ""
    for (let i = 0; i < fullResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20))
      currentText += fullResponse[i]

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: currentText,
                isStreaming: i < fullResponse.length - 1,
              }
            : msg,
        ),
      )
    }

    setIsLoading(false)
  }

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New Chat",
      createdAt: new Date(),
      messageCount: 0,
    }
    setChatSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your AI assistant. How can I help you today?",
      },
    ])
  }

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId)
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id)
      }
    }
  }

  const handleFeedbackSubmit = async (feedback: Omit<Feedback, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      })

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
      throw error
    }
  }

  return (
    <ProtectedRoute requiredRoles={["admin", "developer", "document_manager"]}>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat History Sidebar */}
          <ChatHistorySidebar
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSelectSession={setCurrentSessionId}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />

          {/* Chat Area */}
          <main className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <MessageWithCitations
                      content={message.content}
                      isStreaming={message.isStreaming}
                      citations={message.citations}
                      isUser={message.role === "user"}
                    />
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background/50 p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-3">
                  <Input
                    placeholder="Ask me anything about your documents..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                    disabled={isLoading}
                    className="bg-input border-border"
                  />
                  <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading}>
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: Upload documents to get more accurate answers from the AI assistant.
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Feedback Modal */}
        <FeedbackModal onSubmit={handleFeedbackSubmit} />
      </div>
    </ProtectedRoute>
  )
}
