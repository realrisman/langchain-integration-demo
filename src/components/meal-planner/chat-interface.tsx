import React from "react";
import type { FormEvent } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  messagesEndRef,
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
}) => {
  return (
    <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-slate-200">
      <CardContent className="flex-1 p-4 md:p-6 overflow-y-auto">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-4 bg-white">
        <ChatInputForm
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  );
};
