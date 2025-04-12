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
    <div className="fixed inset-0 flex flex-col w-full h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Glass Morphism Header */}
      <header className="relative z-10 py-3 px-4 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            LangChain Meal Planner
          </h1>
          <p className="hidden md:block text-sm text-muted-foreground max-w-xl">
            AI-powered meal planning assistant
          </p>
        </div>
      </header>

      {/* Main Content Area with Dynamic Height */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full h-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-80 xl:w-96 p-3 lg:h-full overflow-hidden flex flex-col">
            <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 pr-2">
              <AgentInfoCard />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 flex flex-col h-full min-h-0">
            <div className="flex-1 h-full overflow-hidden flex flex-col rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
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
    </div>
  );
}
