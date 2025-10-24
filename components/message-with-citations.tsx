"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { TypingIndicator } from "./typing-indicator"

interface Citation {
  id: string
  title: string
  source: string
  relevance: number
}

interface MessageWithCitationsProps {
  content: string
  isStreaming?: boolean
  citations?: Citation[]
  isUser?: boolean
}

export function MessageWithCitations({
  content,
  isStreaming = false,
  citations = [],
  isUser = false,
}: MessageWithCitationsProps) {
  return (
    <div className="space-y-3">
      <div
        className={`max-w-md lg:max-w-xl px-4 py-3 rounded-lg ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border border-border text-foreground rounded-bl-none"
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
        {isStreaming && <TypingIndicator />}
      </div>

      {/* Citations */}
      {!isUser && citations.length > 0 && (
        <div className="space-y-2 ml-4">
          <p className="text-xs font-medium text-muted-foreground">Sources:</p>
          <div className="space-y-2">
            {citations.map((citation) => (
              <Card key={citation.id} className="border border-border/50 bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{citation.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{citation.source}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <div className="h-1 flex-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${citation.relevance * 100}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.round(citation.relevance * 100)}%</span>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 transition flex-shrink-0"
                      title="View source"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
