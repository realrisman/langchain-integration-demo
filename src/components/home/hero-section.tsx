import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Hero section component for the landing page
 */
export const HeroSection = () => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
      <Badge
        variant="outline"
        className="text-blue-100 border-blue-300 mb-4 px-3 py-1 text-sm"
      >
        LANGCHAIN INTEGRATION DEMO
      </Badge>
      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 tracking-tight">
        AI-Powered Assistants with LangChain
      </h1>
      <p className="text-xl max-w-3xl mb-10 text-blue-100 leading-relaxed">
        Explore the power of LangChain, LangSmith, and LangGraph through
        interactive demos featuring a chatbot and an intelligent meal planning
        system.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="text-blue-700 font-medium"
        >
          <Link href="/chatbot">Try the Chatbot</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="default"
          className="bg-blue-700 hover:bg-blue-800 font-medium"
        >
          <Link href="/meal-planner">Try the Meal Planner</Link>
        </Button>
      </div>
    </div>
  </header>
);
