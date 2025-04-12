"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CornerDownLeft,
  Info,
  Loader2,
  Send,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  Message,
  MessageBubble,
  LoadingIndicator,
  EmptyChat,
} from "@/components/chatbot";
import { ChatService } from "@/lib/services/chat-service";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

/**
 * Hook for managing chat state and interactions
 */
const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (message: Omit<Message, "timestamp">) => {
    const newMessage: Message = {
      ...message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    const userMessage = addMessage({
      role: "user",
      content: content.trim(),
    });

    setInput("");
    setIsLoading(true);

    try {
      // Send to API via service
      const newMessages = [...messages, userMessage];
      const response = await ChatService.sendMessage(newMessages);

      // Add assistant's response
      addMessage({
        role: "assistant",
        content: response,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");

      // Add error message
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
  };
};

/**
 * ChatbotPage - Interactive AI chatbot interface
 */
export default function ChatbotPage() {
  const { messages, input, setInput, isLoading, error, sendMessage } =
    useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 min-h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                LangChain AI
              </h1>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
                About
              </p>
              <div className="p-3 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                  AI Assistant
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  This AI assistant is built using LangChain and OpenAI to
                  provide intelligent responses to your questions.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
                AI Model
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>GPT-3.5 Turbo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>LangChain Framework</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar footer - aligned with input area */}
          <div className="h-16 min-h-16 border-t border-gray-200 dark:border-gray-800 flex items-center px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              <span>All conversations are private and secure</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Chat header */}
        <header className="h-16 min-h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileSidebarOpen((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 h-8 w-8 rounded-full text-blue-600 dark:text-blue-400">
                  <Sparkles size={16} />
                </div>
                <h2 className="text-sm font-semibold">AI Assistant</h2>
              </div>
            </div>

            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    About this assistant
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    This AI assistant is built using LangChain and OpenAI to
                    provide intelligent responses to your questions.
                  </p>
                  <Separator />
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Model: GPT-3.5 Turbo</p>
                    <p>Architecture: LangChain + OpenAI</p>
                    <p>
                      Features: Context-aware responses, natural language
                      understanding
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
          {messages.length === 0 ? (
            <EmptyChat />
          ) : (
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
          )}
        </div>

        {/* Input area - aligned with sidebar footer */}
        <div className="h-16 min-h-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 w-full max-w-4xl mx-auto"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Sending
                  </span>
                </>
              ) : (
                <>
                  <span className="sr-only sm:not-sr-only sm:inline-block">
                    Send
                  </span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
            <div className="hidden md:flex items-center border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs gap-1">
              <CornerDownLeft className="h-3 w-3" />
              <span>Enter</span>
            </div>
          </form>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
