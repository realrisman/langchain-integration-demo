"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { role: "user", content: input };
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
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Add assistant's response to the chat
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto">
      <header className="py-6 border-b mb-6 text-center">
        <h1 className="text-3xl font-bold">LangChain Chatbot</h1>
        <p className="text-gray-500 mt-2">
          Ask me anything and get AI-powered responses
        </p>
      </header>

      <div className="flex-1 overflow-y-auto mb-6 p-6 border rounded-xl bg-gray-50/50 shadow-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-10 space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <div>
              <p className="text-lg font-medium mb-1">No messages yet</p>
              <p>Start a conversation by sending a message below.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-100 ml-auto max-w-[80%] text-blue-900"
                    : "bg-white max-w-[80%] border shadow-sm"
                }`}
              >
                <div className="font-medium text-xs mb-1 text-gray-500">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </div>
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white p-4 rounded-2xl max-w-[80%] border shadow-sm">
                <div className="font-medium text-xs mb-1 text-gray-500">
                  AI Assistant
                </div>
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <span className="text-gray-400 ml-2">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 px-2 pb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 rounded-full disabled:bg-blue-400 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
