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

interface Source {
  file_path: string
  file_name: string
  file_type: string
  relevance_score: number
  content_preview: string
}

interface MessageWithCitationsProps {
  content: string
  isStreaming?: boolean
  citations?: Citation[]
  sources?: Source[]
  isUser?: boolean
}

export function MessageWithCitations({
  content,
  isStreaming = false,
  citations = [],
  sources = [],
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

      {/* Sources (new format) */}
      {!isUser && sources.length > 0 && (
        <div className="space-y-2 ml-4">
          <p className="text-xs font-medium text-muted-foreground">📚 Sources ({sources.length}):</p>
          <div className="space-y-2">
            {sources.map((source, idx) => (
              <Card key={`${source.file_path}-${idx}`} className="border border-border/50 bg-muted/30">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-semibold text-foreground">{source.file_name}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{source.file_type}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2" title={source.file_path}>{source.file_path}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500" style={{ width: `${source.relevance_score * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">{(source.relevance_score * 100).toFixed(1)}%</span>
                      </div>
                      {source.content_preview && (
                        <details className="mt-2 text-xs">
                          <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium">Preview</summary>
                          <pre className="mt-1 p-2 rounded bg-muted text-xs whitespace-pre-wrap break-words">{source.content_preview}</pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Citations (legacy format, keep for backward compatibility) */}
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
