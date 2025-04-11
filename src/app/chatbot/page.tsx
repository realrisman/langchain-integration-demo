"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Send } from "lucide-react";
import { Message, MessageBubble } from "@/components/chatbot/message-bubble";
import { LoadingIndicator } from "@/components/chatbot/loading-indicator";
import { EmptyChat } from "@/components/chatbot/empty-chat";
import { ChatService } from "@/lib/services/chat-service";

/**
 * ChatbotPage - Interactive AI chatbot interface
 */
export default function ChatbotPage() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    // Auto-scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Send to API via service
      const response = await ChatService.sendMessage(newMessages);

      // Add assistant's response to the chat
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 h-[calc(100vh-64px)] flex flex-col">
      <Card className="flex flex-col h-full shadow-lg border-opacity-40">
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
              <Bot size={20} />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LangChain Chatbot
              </CardTitle>
              <CardDescription>
                Powered by AI to provide intelligent responses to your questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden">
          {messages.length === 0 ? (
            <EmptyChat />
          ) : (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <MessageBubble key={index} message={message} />
                  ))}

                  {isLoading && <LoadingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>

        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
