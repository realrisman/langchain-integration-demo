import { Bot, CookingPot, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";

/**
 * Top navigation component for the application
 */
export function TopNavigation() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-blue-600"
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
          <span className="hidden sm:inline">LangChain Integration Demo</span>
          <span className="inline sm:hidden">LangChain</span>
        </Link>
        <nav className="flex justify-center">
          <ul className="flex gap-1 md:gap-2">
            <li>
              <Link
                href="/"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/chatbot"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Bot className="w-4 h-4 mr-2" />
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                href="/meal-planner"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <CookingPot className="w-4 h-4 mr-2" />
                Meal Planner
              </Link>
            </li>
            <li>
              <Link
                href="https://smith.langchain.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                LangSmith Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
