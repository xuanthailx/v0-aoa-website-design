'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
}

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
}

export function ChatHistorySidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
}: ChatHistorySidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-64 border-r border-border bg-surface/50 flex flex-col fixed h-[calc(100vh-4rem)] top-16 left-0 z-10">
      <div className="p-4 border-b border-border">
        <Button className="w-full gap-2" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Chat History
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="px-4 space-y-2">
            {sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="relative"
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      currentSessionId === session.id
                        ? 'bg-primary/10 border border-primary/50'
                        : 'hover:bg-muted border border-border'
                    }`}
                  >
                    <div className="flex items-start gap-2 min-w-0">
                      <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {session.messageCount} message
                          {session.messageCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </button>
                  {hoveredId === session.id && (
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-destructive transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">
                No chat history yet
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
