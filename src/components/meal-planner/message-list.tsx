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
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  messagesEndRef,
  setInputValue,
  inputRef,
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
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
};
