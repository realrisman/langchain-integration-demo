"use client";

import { Button } from "@/components/ui/button";
import { Info, Sparkles } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";

type ChatHeaderProps = {
  setMobileSidebarOpen: (open: boolean) => void;
  hasMessages: boolean;
  resetChat: () => void;
};

export function ChatHeader({
  setMobileSidebarOpen,
  hasMessages,
  resetChat,
}: ChatHeaderProps) {
  return (
    <header className="h-16 min-h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
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
          {hasMessages && (
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
                <h4 className="text-sm font-semibold">About this assistant</h4>
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
  );
}
