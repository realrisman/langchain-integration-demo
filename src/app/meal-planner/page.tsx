"use client";

import { useEffect, useRef } from "react";
import { AgentInfoCard, ChatInterface } from "@/components/meal-planner";
import {
  useMealPlannerStore,
  useMealPlannerActions,
} from "@/store/meal-planner";

export default function MealPlannerPage() {
  const { messages, inputValue, setInputValue, isLoading } =
    useMealPlannerStore();

  const { handleSubmit, cancelRequest } = useMealPlannerActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests
      cancelRequest();
    };
  }, [cancelRequest]);

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col">
        <AgentInfoCard />
        <ChatInterface
          messages={messages}
          messagesEndRef={messagesEndRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
