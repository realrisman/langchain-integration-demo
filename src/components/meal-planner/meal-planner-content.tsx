import React from "react";
import { AgentInfoCard, ChatInterface } from "./index";
import { Message } from "@/types";

interface MealPlannerContentProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export function MealPlannerContent({
  messages,
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
  messagesEndRef,
  inputRef,
}: MealPlannerContentProps) {
  return (
    <>
      {/* Sidebar - collapsible on mobile */}
      <div className="lg:w-80 xl:w-96 lg:h-full overflow-hidden flex flex-col animate-fade-right animate-duration-500">
        <div className="h-full overflow-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <AgentInfoCard />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full min-h-0 animate-fade-up animate-duration-500">
        <div className="flex-1 h-full overflow-hidden flex flex-col rounded-xl shadow-lg border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <ChatInterface
            messages={messages}
            messagesEndRef={messagesEndRef}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            inputRef={inputRef}
          />
        </div>
      </div>
    </>
  );
}
