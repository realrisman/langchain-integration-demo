import Link from "next/link";
import { Bot, CookingPot, ArrowRight } from "lucide-react";

/**
 * Hero section component for the landing page
 */
export function HeroSection() {
  return (
    <div className="relative isolate overflow-hidden px-6 lg:px-8 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_50%_at_50%_50%,#3b82f680_0%,rgba(255,255,255,0)_100%)] opacity-20 dark:opacity-30" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white dark:bg-slate-950 shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 dark:ring-blue-950/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
          <span className="text-blue-600">Lang</span>Chain,{" "}
          <span className="text-blue-600">Lang</span>Smith &{" "}
          <span className="text-blue-600">Lang</span>Graph Integration
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive demonstration showcasing the practical implementation
          of LangChain, LangSmith, and LangGraph. Explore our chatbot and
          multi-agent meal planning system built with cutting-edge AI
          technologies.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/chatbot"
            className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Bot className="mr-2 h-4 w-4" />
            Try the Chatbot
          </Link>
          <Link
            href="/meal-planner"
            className="inline-flex items-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 hover:bg-gray-50 dark:bg-slate-800 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            <CookingPot className="mr-2 h-4 w-4" />
            Explore Meal Planner
          </Link>
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="#features"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Learn more about the project
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-16 mx-auto max-w-2xl overflow-hidden rounded-xl bg-white/5 shadow-2xl ring-1 ring-white/10 dark:bg-slate-900/30 dark:ring-white/5">
        <div className="p-4 bg-gray-50 dark:bg-slate-800 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            AI Chatbot Demo
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200">
              Hello! I&apos;m your AI assistant powered by LangChain. How can I
              help you today?
            </div>
          </div>
          <div className="flex items-start gap-4 justify-end">
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200">
              Can you help me plan a healthy meal for dinner tonight?
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <div className="text-xs font-medium">You</div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200">
              I&apos;d be happy to help! Let me connect you with our meal
              planning system powered by LangGraph...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
