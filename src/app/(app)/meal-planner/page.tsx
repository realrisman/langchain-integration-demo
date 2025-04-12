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
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<
    HTMLInputElement | HTMLTextAreaElement
  >;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests
      cancelRequest();
    };
  }, [cancelRequest]);

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <div className="flex flex-col w-full h-full">
        {/* Header Section - Reduced padding for more content space */}
        <header className="py-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
              LangChain Meal Planner
            </h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Generate personalized meal plans and recipes with AI-powered
              suggestions tailored to your dietary preferences and nutritional
              needs.
            </p>
          </div>
        </header>

        {/* Main Content - Taking remaining height with proper overflow handling */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4">
          {/* Sidebar with overflow auto */}
          <div className="lg:col-span-1 space-y-4 overflow-auto pr-2">
            <AgentInfoCard />
          </div>

          {/* Chat Interface - Only this should scroll */}
          <div className="lg:col-span-2 h-full flex">
            <ChatInterface
              messages={messages}
              messagesEndRef={messagesEndRef}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
