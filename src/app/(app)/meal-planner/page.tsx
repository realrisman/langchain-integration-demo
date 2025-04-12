"use client";

import { useEffect, useRef } from "react";
import { AgentInfoCard, ChatInterface } from "@/components/meal-planner";
import {
  useMealPlannerStore,
  useMealPlannerActions,
} from "@/store/meal-planner";
import { CookingPot, Sparkles } from "lucide-react";

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
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex flex-col space-y-2 mb-6">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          LangChain Meal Planner
        </h1>
        <p className="text-muted-foreground">
          Generate personalized meal plans and recipes with AI
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-1">
          <AgentInfoCard />

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center bg-white dark:bg-slate-800 h-10 w-10 rounded-full text-indigo-600 dark:text-indigo-400 shadow-sm">
                <Sparkles size={18} />
              </div>
              <h3 className="font-semibold">AI-Powered Planning</h3>
            </div>
            <p className="text-sm text-foreground/80 mb-4">
              Our meal planner uses LangGraph to create personalized meal plans
              based on your preferences and dietary requirements.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center bg-white dark:bg-slate-800 h-10 w-10 rounded-full text-purple-600 dark:text-purple-400 shadow-sm">
                <CookingPot size={18} />
              </div>
              <h3 className="font-semibold">Complete Recipes</h3>
            </div>
            <p className="text-sm text-foreground/80 mt-2">
              Get detailed recipes with ingredients, instructions, and
              nutritional information.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
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
  );
}
