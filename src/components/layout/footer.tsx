import Link from "next/link";
import { Github, Bot, CookingPot, LayoutDashboard } from "lucide-react";

/**
 * Footer component for the application
 */
export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>LangChain Integration Demo</span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-md">
              A comprehensive demonstration of LangChain, LangSmith, and
              LangGraph implementations featuring a chatbot and multi-agent meal
              planning system.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/realrisman/langchain-integration-demo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Features
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/chatbot"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  <span>Chatbot</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/meal-planner"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <CookingPot className="h-4 w-4" />
                  <span>Meal Planner</span>
                </Link>
              </li>
              <li>
                <Link
                  href="https://smith.langchain.com/"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>LangSmith Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://js.langchain.com/docs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  LangChain Docs
                </a>
              </li>
              <li>
                <a
                  href="https://docs.smith.langchain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  LangSmith Docs
                </a>
              </li>
              <li>
                <a
                  href="https://langchain-ai.github.io/langgraphjs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  LangGraph Docs
                </a>
              </li>
              <li>
                <a
                  href="https://platform.openai.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                >
                  OpenAI Platform
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} LangChain Integration Demo. All
            rights reserved.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 sm:mt-0">
            Built by{" "}
            <a
              href="https://github.com/realrisman"
              className="text-blue-600 hover:underline"
            >
              Muhamad Risman
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
