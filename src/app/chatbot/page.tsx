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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add assistant's response to the chat
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-4">
              <div className="p-8 bg-blue-50 rounded-full mb-6">
                <Bot className="h-12 w-12 text-blue-500" />
              </div>
              <div>
                <p className="text-xl font-medium mb-2 text-gray-700">
                  Start a conversation
                </p>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Ask a question or start a conversation with the AI assistant.
                </p>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex max-w-[80%] ${
                          message.role === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        } gap-3`}
                      >
                        <Avatar
                          className={`h-8 w-8 ${
                            message.role === "user"
                              ? "bg-blue-100 text-blue-600 border border-blue-200"
                              : "bg-indigo-100 text-indigo-600 border border-indigo-200"
                          }`}
                        >
                          <AvatarImage
                            src={
                              message.role === "user"
                                ? "/images/user-avatar.svg"
                                : "/images/ai-avatar.svg"
                            }
                            alt={
                              message.role === "user" ? "User" : "AI Assistant"
                            }
                          />
                          <AvatarFallback className="text-xs">
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">
                              {message.role === "user" ? "You" : "AI Assistant"}
                            </span>
                            <span>•</span>
                            <time dateTime={message.timestamp.toISOString()}>
                              {formatTime(message.timestamp)}
                            </time>
                          </div>

                          <div
                            className={`p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800"
                            } shadow-sm`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] flex-row gap-3">
                        <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-600 border border-indigo-200">
                          <AvatarImage
                            src="/images/ai-avatar.svg"
                            alt="AI Assistant"
                          />
                          <AvatarFallback className="text-xs">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">AI Assistant</span>
                            <span>•</span>
                            <time dateTime={new Date().toISOString()}>
                              {formatTime(new Date())}
                            </time>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-100 flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                            <span className="text-gray-500">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
