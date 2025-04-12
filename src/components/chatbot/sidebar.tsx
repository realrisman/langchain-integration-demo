"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageSquare,
  UtensilsCrossed,
  Sparkles,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarProps = {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
};

export function Sidebar({
  mobileSidebarOpen,
  setMobileSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-16 min-h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              LangChain AI
            </h1>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {/* Navigation Section */}
          <div className="space-y-1 mb-6">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Navigation
            </p>
            <nav className="space-y-2">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="block"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    pathname === "/"
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Home className="h-5 w-5 min-w-5" />
                  <span className="text-sm font-medium">Home</span>
                </div>
              </Link>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                <MessageSquare className="h-5 w-5 min-w-5" />
                <span className="text-sm font-medium">Chatbot</span>
              </div>
              <Link
                href="/meal-planner"
                onClick={() => setMobileSidebarOpen(false)}
                className="block"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    pathname === "/meal-planner"
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <UtensilsCrossed className="h-5 w-5 min-w-5" />
                  <span className="text-sm font-medium">Meal Planner</span>
                </div>
              </Link>
            </nav>
          </div>

          <div className="space-y-1">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
              About
            </p>
            <div className="p-3 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                AI Assistant
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-xs">
                This AI assistant is built using LangChain and OpenAI to provide
                intelligent responses to your questions.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">
              AI Model
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>GPT-3.5 Turbo</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>LangChain Framework</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar footer - aligned with input area */}
        <div className="h-24 min-h-24 border-t border-gray-200 dark:border-gray-800 flex items-center px-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Lock className="h-3.5 w-3.5" />
            <span>All conversations are private and secure</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
