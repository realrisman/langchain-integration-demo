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
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-3 md:p-5 overflow-y-auto">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <div className="border-t p-3 md:p-4 bg-white dark:bg-slate-900/80 dark:border-slate-700">
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
