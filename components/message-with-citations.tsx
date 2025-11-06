"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Copy } from "lucide-react"
import { TypingIndicator } from "./typing-indicator"
import { useState } from "react"

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
  const [copied, setCopied] = useState(false)

  // Small, safe formatter: escape HTML and apply light markdown-like transforms
  const escapeHtml = (unsafe: string) =>
    unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")

  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noreferrer" class="underline text-primary">${url}</a>`)
  }

  const simpleMarkdown = (text: string) => {
    // bold **text**
    let s = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // italic *text*
    s = s.replace(/\*(.*?)\*/g, "<em>$1</em>")
    // inline code `code`
    s = s.replace(/`([^`]+)`/g, "<code class=\"rounded bg-muted/50 px-1 py-0.5 text-[0.85em]\">$1</code>")
    return s
  }

  const formatContent = (text: string) => {
    if (!text) return ""
    const escaped = escapeHtml(text)
    const withLinks = linkify(escaped)
    const withMd = simpleMarkdown(withLinks)
    // preserve paragraphs
    return withMd.replace(/\n{2,}/g, "</p><p>").replace(/\n/g, "<br />")
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      // ignore
    }
  }
  return (
    <div className="space-y-3">
      <div
        className={`max-w-md lg:max-w-xl px-4 py-3 rounded-lg relative ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card border border-border text-foreground rounded-bl-none"
        }`}
      >
        {/* Actions: copy */}
        {!isUser && (
          <button
            onClick={handleCopy}
            aria-label="Copy response"
            className="absolute top-2 right-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted/50 z-30"
            title="Copy response"
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">{copied ? "Copied" : "Copy"}</span>
          </button>
        )}

  <div className="prose max-w-none text-sm leading-relaxed pr-10" dangerouslySetInnerHTML={{ __html: `<p>${formatContent(content)}</p>` }} />
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
