"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat";
import {
  MessageBubble,
  LoadingIndicator,
  EmptyChat,
} from "@/components/chatbot";

type ChatMessagesProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
};

export function ChatMessages({
  messages,
  isLoading,
  error,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyChat />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {isLoading && <LoadingIndicator />}

          {error && (
            <div className="p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </ScrollArea>
  );
}
