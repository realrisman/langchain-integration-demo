"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Info,
  Loader2,
  Send,
  Sparkles,
  Lock,
  Home,
  UtensilsCrossed,
  MessageSquare,
} from "lucide-react";
import {
  MessageBubble,
  LoadingIndicator,
  EmptyChat,
} from "@/components/chatbot";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * ChatbotPage - Interactive AI chatbot interface
 */
export default function ChatbotPage() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    resetChat,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 160);
      textarea.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight(); // Initial adjustment

    return () => {
      textarea.removeEventListener("input", adjustHeight);
    };
  }, [input]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage(input);

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
            {/* Navigation Section */}
            <div className="space-y-1 mb-6">
              <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
                Navigation
              </p>
              <nav className="space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="block"
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      pathname === "/"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Home className="h-5 w-5 min-w-5" />
                    <span className="text-sm font-medium">Home</span>
                  </div>
                </Link>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <MessageSquare className="h-5 w-5 min-w-5" />
                  <span className="text-sm font-medium">Chatbot</span>
                </div>
                <Link
                  href="/meal-planner"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="block"
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      pathname === "/meal-planner"
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <UtensilsCrossed className="h-5 w-5 min-w-5" />
                    <span className="text-sm font-medium">Meal Planner</span>
                  </div>
                </Link>
              </nav>
            </div>

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
          <div className="h-24 min-h-24 border-t border-gray-200 dark:border-gray-800 flex items-center px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Lock className="h-3.5 w-3.5" />
              <span>All conversations are private and secure</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
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

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetChat}
                  className="text-xs"
                >
                  Reset Chat
                </Button>
              )}
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
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pb-32">
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

        {/* Floating input area */}
        <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 w-full max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-200 ease-in-out hover:shadow-2xl"
          >
            {/* Custom styled textarea container */}
            <div className="relative flex-1 min-h-10 group">
              <div className="w-full min-h-[40px] max-h-[160px] overflow-y-auto">
                <textarea
                  ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="w-full min-h-[40px] bg-transparent border-none shadow-none outline-none resize-none p-0 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-inherit leading-relaxed"
                  disabled={isLoading}
                  rows={1}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>
              {/* Subtle gradient border animation on focus */}
              <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 rounded-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-70"></div>
            </div>
            <div className="flex flex-col justify-end">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full w-11 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>

          {/* Keyboard hint */}
          <div className="flex justify-center mt-3">
            <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-xs gap-1 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-[10px]">
                Shift
              </kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-[10px]">
                Enter
              </kbd>
              <span>for a new line</span>
            </div>
          </div>
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
