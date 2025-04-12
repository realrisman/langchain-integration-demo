import React from "react";
import { Message } from "@/types/meal-planner";
import { MessageItem } from "./message-item";
import { EmptyChatState } from "./empty-chat-state";

/**
 * Displays a list of chat messages or an empty state
 */
interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  setInputValue?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  isLoading?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  setInputValue,
  inputRef,
  isLoading,
}) => {
  // Early return for empty messages
  if (messages.length === 0) {
    return <EmptyChatState setInputValue={setInputValue} inputRef={inputRef} />;
  }

  return (
    <div className="space-y-5">
      {messages.map((message, index) => (
        <MessageItem key={message.id || index} message={message} />
      ))}

      {isLoading && (
        <div className="flex justify-start animate-fade-right animate-duration-300">
          <div className="max-w-[85%] rounded-xl shadow-md p-4 backdrop-blur-md bg-gradient-to-r from-white/95 to-white/85 dark:from-slate-800/95 dark:to-slate-800/85 border border-indigo-100/50 dark:border-indigo-900/30 rounded-tl-none shadow-indigo-100/20 dark:shadow-indigo-900/10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-300/30 dark:shadow-indigo-900/30">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2 12.7A7 7 0 0 1 12 7a1 1 0 0 1 1 1v4a7 7 0 0 1-10 6.3 1 1 0 0 1-.5-1.3 1 1 0 0 1 .5-.5C4 16 5 15.4 5 14V9a1 1 0 0 1 1.7-.7A5 5 0 0 1 12 9" />
                  <path d="M12 8a6 6 0 0 1 9.3 5 1 1 0 0 1-1.3 1 1 1 0 0 1-.7-.3 4 4 0 0 0-2.5-1 1 1 0 0 0-1 1V15c0 1.5 1 2 2 2.5a1 1 0 0 1 .5.5 1 1 0 0 1-.5 1.3 7 7 0 0 1-10-6.3V12" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-indigo-700 dark:text-indigo-300">
                  Chef Assistant
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Preparing your response...
                </div>
              </div>
            </div>

            <div className="flex pl-2 items-end h-6">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};
