"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chat-store";
import {
  Sidebar,
  ChatHeader,
  ChatMessages,
  ChatInput,
} from "@/components/chatbot";

/**
 * ChatbotPage - Interactive AI chatbot interface
 */
export default function ChatbotPage() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    resetChat,
  } = useChatStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Chat Header Component */}
        <ChatHeader
          setMobileSidebarOpen={setMobileSidebarOpen}
          hasMessages={messages.length > 0}
          resetChat={resetChat}
        />

        {/* Chat Messages Component */}
        <div className="flex-1 overflow-hidden relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pb-32">
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Chat Input Component */}
        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </main>

      {/* Overlay for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
}
