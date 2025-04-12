import Link from "next/link";
import { Home, Bot, CookingPot } from "lucide-react";

export function MealPlannerHeader() {
  return (
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
  );
}
