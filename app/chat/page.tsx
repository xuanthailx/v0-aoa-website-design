'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProtectedRoute } from '@/components/protected-route';
import { AppHeader } from '@/components/app-header';
import { FeedbackModal } from '@/components/feedback-modal';
import { MessageWithCitations } from '@/components/message-with-citations';
import { ChatHistorySidebar } from '@/components/chat-history-sidebar';
import type { Feedback } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{
    id: string;
    title: string;
    source: string;
    relevance: number;
  }>;
  sources?: Array<{
    file_path: string;
    file_name: string;
    file_type: string;
    relevance_score: number;
    content_preview: string;
  }>;
  metadata?: {
    retrieved_documents: number;
    timestamp: string;
    model: string;
    temperature: number;
    max_tokens: number;
  };
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
}

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: 'session_1',
      title: 'Getting Started',
      createdAt: new Date(Date.now() - 86400000),
      messageCount: 3,
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('session_1');
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    session_1: [
      {
        id: '1',
        role: 'assistant',
        content:
          "Hello! I'm your AI assistant. Upload a document to get started, or ask me anything about your documents.",
      },
      {
        id: '2',
        role: 'user',
        content: 'How do I install ChromaDB?',
      },
      {
        id: '3',
        role: 'assistant',
        content:
          'To install ChromaDB based on the provided documents, you can follow these instructions:\n\n1. **Basic Installation**: You can add ChromaDB to your project by including it in your `requirements.txt` file using the following line:\n   ```\n   chromadb>=0.4.0\n   ```\n\n2. **Optional Server Integration**: If you want to install the server integration, you can run the following command:\n   ```\n   pip install "chromadb[server]"\n   ```\n\nThese steps will set up ChromaDB for use in your project. You can refer to Document 2 for these installation details.',
        sources: [
          {
            file_path: 'documents/Architecture.md',
            file_name: 'Architecture.md',
            file_type: '.md',
            relevance_score: -0.287,
            content_preview:
              '## 🔄 Quy Trình Hoạt Động Chi Tiết\n\n### Phase 1: Khởi Động & Load Documents\n\n```mermaid\ngraph TD\n    A[Start Application] --> B[Load .env Config]\n    B --> C[Initialize Services]\n    C --> D{AUTO_LOAD_...',
          },
        ],
        metadata: {
          retrieved_documents: 5,
          timestamp: '2025-11-14T14:20:43.480580',
          model: 'GPT-4o-mini',
          temperature: 0.7,
          max_tokens: 500,
        },
      },
    ],
  });
  const [messages, setMessages] = useState<Message[]>(chatHistory.session_1);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [maxTokens, setMaxTokens] = useState<number>(500);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'You are a helpful assistant.'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Save messages to chat history when they change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      setChatHistory(prev => ({
        ...prev,
        [currentSessionId]: messages
      }));
    }
  }, [messages, currentSessionId]);

  const handleSendMessage = async () => {
    setFormError(null);
    if (!input.trim()) {
      setFormError('Please enter a question or prompt.');
      return;
    }

    if (!Number.isFinite(maxTokens) || maxTokens <= 0 || maxTokens > 2000) {
      setFormError('Max tokens must be a number between 1 and 2000.');
      return;
    }

    if (temperature < 0 || temperature > 1) {
      setFormError('Temperature must be between 0 and 1.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setChatSessions((prev) =>
      prev.map((session: ChatSession) =>
        session.id === currentSessionId
          ? { ...session, messageCount: session.messageCount++ }
          : session
      )
    );

    // Call backend proxy for a real assistant reply
    try {
      const proxyUrl =
        (process.env.NEXT_PUBLIC_API_PROXY_URL as string) ||
        'http://localhost:8000';
      const resp = await fetch(`${proxyUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //max_tokens: maxTokens,
          temperature,
          conversation_id: currentSessionId,
          message: userMessage.content,
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Proxy returned non-OK:', resp.status, text);
        throw new Error(`Proxy error: ${resp.status}`);
      }

      const data = await resp.json();

      // Remove duplicate sources based on file_path
      const uniqueSources = data.sources
        ? (Array.from(
            new Map(
              data.sources.map((source: any) => [source.file_path, source])
            ).values()
          ) as Array<{
            file_path: string;
            file_name: string;
            file_type: string;
            relevance_score: number;
            content_preview: string;
          }>)
        : [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.reply || '',
        sources: uniqueSources,
        metadata: data.metadata || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message to proxy:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: 'Error: failed to get response from server.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (sessionId: string) => {
    // Save current messages to history before switching
    if (currentSessionId && messages.length > 0) {
      setChatHistory(prev => ({
        ...prev,
        [currentSessionId]: messages
      }));
    }
    
    // Switch to selected session
    setCurrentSessionId(sessionId);
    const sessionMessages = chatHistory[sessionId] || [
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
      },
    ];
    setMessages(sessionMessages);
  };

  const handleNewChat = () => {
    // Save current messages to history before creating new chat
    if (currentSessionId && messages.length > 0) {
      setChatHistory(prev => ({
        ...prev,
        [currentSessionId]: messages
      }));
    }

    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Chat',
      createdAt: new Date(),
      messageCount: 0,
    };
    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm your AI assistant. How can I help you today?",
      },
    ]);
  };

  const handleDeleteSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remaining = chatSessions.filter((s) => s.id !== sessionId);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      }
    }
  };

  const handleFeedbackSubmit = async (
    feedback: Omit<Feedback, 'id' | 'createdAt'>
  ) => {
    try {
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  return (
    <ProtectedRoute requiredRoles={['admin', 'developer', 'document_manager']}>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader />

        {/* Main Content */}
        <div
          className="flex-1 flex overflow-hidden"
          style={{
            position: 'relative',
          }}
        >
          {/* Chat History Sidebar */}
          <ChatHistorySidebar
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />

          {/* Chat Area */}
          <main className="flex-1 flex flex-col ml-64">
            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {/* Avatar */}
                    {message.role === 'assistant' && (
                      <div className="hidden md:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-700 dark:text-violet-300 font-bold text-sm shadow-sm">
                        AI
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] ${
                        message.role === 'user' ? 'order-first' : ''
                      }`}
                    >
                      <div
                        className={`inline-block rounded-2xl px-2 py-2 shadow-md leading-relaxed whitespace-pre-wrap break-words text-sm transition-all hover:shadow-lg ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white'
                            : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        <MessageWithCitations
                          content={message.content}
                          isStreaming={message.isStreaming}
                          citations={message.citations}
                          isUser={message.role === 'user'}
                        />
                      </div>

                      {/* Sources Section */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>Sources ({message.sources.length})</span>
                          </div>
                          <div className="space-y-2">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="group relative rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-start gap-3">
                                  {/* File Icon */}
                                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-500/10 flex items-center justify-center">
                                    <svg
                                      className="h-5 w-5 text-violet-600 dark:text-violet-400"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {/* File Name */}
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                        {source.file_name}
                                      </h4>
                                      <span className="flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                                        {source.file_type}
                                      </span>
                                    </div>

                                    {/* File Path */}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
                                      {source.file_path}
                                    </p>

                                    {/* Content Preview */}
                                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-2">
                                      {source.content_preview}
                                    </p>

                                    {/* Relevance Score */}
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center gap-1">
                                        <svg
                                          className="h-3.5 w-3.5 text-amber-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                          Relevance:{' '}
                                          {Math.abs(
                                            source.relevance_score
                                          ).toFixed(3)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Metadata
                          {message.metadata && (
                            <div className="mt-3 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                  </svg>
                                  <span className="font-medium">{message.metadata.model}</span>
                                </span>
                                <span>•</span>
                                <span>{message.metadata.retrieved_documents} docs</span>
                                <span>•</span>
                                <span>Temp: {message.metadata.temperature}</span>
                                <span>•</span>
                                <span>Max tokens: {message.metadata.max_tokens}</span>
                              </div>
                            </div>
                          )} */}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
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
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            AI is thinking...
                          </span>
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
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (!isLoading && input.trim()) handleSendMessage();
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
                          <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending
                        </span>
                      ) : (
                        'Send'
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Button
                      variant="ghost"
                      onClick={() => setShowAdvanced((s) => !s)}
                    >
                      {showAdvanced ? 'Hide options' : 'Advanced options'}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      Tip: Upload documents for better answers.
                    </div>
                  </div>

                  {formError && (
                    <div className="text-sm text-red-500 mt-2">{formError}</div>
                  )}

                  {showAdvanced && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground mb-1">
                          Model
                        </label>
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="input bg-input border-border p-2"
                        >
                          <option value="gpt-4o-mini">gpt-4o-mini</option>
                          <option value="gpt-4o">gpt-4o</option>
                          <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground mb-1">
                          Max tokens
                        </label>
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
                        <label className="text-xs text-muted-foreground mb-1">
                          Temperature: {temperature.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={temperature}
                          onChange={(e) =>
                            setTemperature(Number(e.target.value))
                          }
                        />
                      </div>

                      <div className="flex flex-col md:col-span-2">
                        <label className="text-xs text-muted-foreground mb-1">
                          System prompt (optional)
                        </label>
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
  );
}
