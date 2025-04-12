"use client";

import { useEffect, useRef } from "react";
import { AgentInfoCard, ChatInterface } from "@/components/meal-planner";
import {
  useMealPlannerStore,
  useMealPlannerActions,
} from "@/store/meal-planner";
import Link from "next/link";
import { Home, Bot, CookingPot } from "lucide-react";

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
    <div className="fixed inset-0 flex flex-col w-full h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-950">
      {/* Header with glass morphism effect */}
      <header className="relative z-10 py-3 px-4 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Meal Planner
            </h1>
            <span className="hidden md:inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
              Powered by LangChain
            </span>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex gap-1 md:gap-3">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <Home className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/chatbot"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <Bot className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Chatbot</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/meal-planner"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                  aria-current="page"
                >
                  <CookingPot className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Meal Planner</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Area with Dynamic Height */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 right-[10%] w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-[5%] w-72 h-72 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-blue-300/10 dark:bg-blue-600/5 rounded-full filter blur-3xl"></div>
        </div>

        <div className="w-full h-full max-w-screen-2xl mx-auto flex flex-col lg:flex-row p-3 lg:p-5 gap-4 z-10">
          {/* Sidebar - collapsible on mobile */}
          <div className="lg:w-80 xl:w-96 lg:h-full overflow-hidden flex flex-col animate-fade-right animate-duration-500">
            <div className="h-full overflow-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <AgentInfoCard />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full min-h-0 animate-fade-up animate-duration-500">
            <div className="flex-1 h-full overflow-hidden flex flex-col rounded-xl shadow-lg border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
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
