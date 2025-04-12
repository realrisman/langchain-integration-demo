import React from "react";
import type { FormEvent } from "react";
import { Message } from "@/types/meal-planner";
import { MessageList } from "./message-list";
import { ChatInputForm } from "./chat-input-form";

/**
 * ChatInterface component that displays the message list and input form
 */
interface ChatInterfaceProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  messagesEndRef,
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
  inputRef,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Subtle pattern overlay for chat background */}
      <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/20 bg-[size:20px_20px] opacity-50 pointer-events-none"></div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto relative z-10 scroll-smooth scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>

      <div className="border-t p-4 md:p-5 bg-white/90 dark:bg-slate-900/90 dark:border-slate-700/70 backdrop-blur-md relative z-10">
        <ChatInputForm
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
};
