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
  const [model, setModel] = useState("gpt-4o-mini")
  const [maxTokens, setMaxTokens] = useState<number>(500)
  const [temperature, setTemperature] = useState<number>(0.7)
  const [systemPrompt, setSystemPrompt] = useState<string>("You are a helpful assistant.")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
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
    setFormError(null)
    if (!input.trim()) {
      setFormError("Please enter a question or prompt.")
      return
    }

    if (!Number.isFinite(maxTokens) || maxTokens <= 0 || maxTokens > 2000) {
      setFormError("Max tokens must be a number between 1 and 2000.")
      return
    }

    if (temperature < 0 || temperature > 1) {
      setFormError("Temperature must be between 0 and 1.")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Call backend proxy for a real assistant reply
    try {
      const proxyUrl = (process.env.NEXT_PUBLIC_API_PROXY_URL as string) || "http://localhost:8000"
      const resp = await fetch(`${proxyUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage.content,
          model,
          max_tokens: maxTokens,
          temperature,
          system_prompt: systemPrompt,
        }),
      })

      if (!resp.ok) {
        const text = await resp.text()
        console.error("Proxy returned non-OK:", resp.status, text)
        throw new Error(`Proxy error: ${resp.status}`)
      }

      const data = await resp.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "",
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Error sending message to proxy:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "Error: failed to get response from server.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
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
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Avatar */}
                    {message.role === "assistant" && (
                      <div className="hidden md:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-700 dark:text-violet-300 font-bold text-sm shadow-sm">
                        AI
                      </div>
                    )}

                    <div className={`max-w-[85%] ${message.role === "user" ? "order-first" : ""}`}>
                      <div
                        className={`inline-block rounded-2xl px-2 py-2 shadow-md leading-relaxed whitespace-pre-wrap break-words text-sm transition-all hover:shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white"
                            : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        <MessageWithCitations
                          content={message.content}
                          isStreaming={message.isStreaming}
                          citations={message.citations}
                          isUser={message.role === "user"}
                        />
                      </div>
                    </div>

                    {message.role === "user" && (
                      <div className="hidden md:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-md">
                        You
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Beautiful loading indicator */}
                {isLoading && (
                  <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="hidden md:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 shadow-sm">
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 animate-pulse" />
                    </div>
                    <div className="max-w-[85%]">
                      <div className="inline-block rounded-2xl px-5 py-3.5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background/50 p-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <label htmlFor="chat-input" className="sr-only">
                        Chat message
                      </label>
                      <textarea
                        id="chat-input"
                        placeholder="Ask me anything... ✨ (Shift+Enter for new line, Enter to send)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            if (!isLoading && input.trim()) handleSendMessage()
                          }
                        }}
                        disabled={isLoading}
                        rows={3}
                        className="w-full min-h-[60px] max-h-[200px] resize-y rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                      />
                      {isLoading && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium">
                          <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                          Processing...
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      size="lg"
                      className="px-8 py-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending
                        </span>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Button variant="ghost" onClick={() => setShowAdvanced((s) => !s)}>
                      {showAdvanced ? "Hide options" : "Advanced options"}
                    </Button>
                    <div className="text-xs text-muted-foreground">Tip: Upload documents for better answers.</div>
                  </div>

                  {formError && <div className="text-sm text-red-500 mt-2">{formError}</div>}

                  {showAdvanced && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground mb-1">Model</label>
                        <select value={model} onChange={(e) => setModel(e.target.value)} className="input bg-input border-border p-2">
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground mb-1">Max tokens</label>
                        <input
                          type="number"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(Number(e.target.value))}
                          min={1}
                          max={2000}
                          className="input bg-input border-border p-2"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground mb-1">Temperature: {temperature.toFixed(2)}</label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={temperature}
                          onChange={(e) => setTemperature(Number(e.target.value))}
                        />
                      </div>

                      <div className="flex flex-col md:col-span-2">
                        <label className="text-xs text-muted-foreground mb-1">System prompt (optional)</label>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          rows={3}
                          className="input bg-input border-border p-2"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {/* kept for screen readers and fallback */}
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
