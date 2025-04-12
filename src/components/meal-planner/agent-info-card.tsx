import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { agentData } from "@/data/meal-planner";
import { Badge } from "@/components/ui/badge";

/**
 * Displays information about the specialized agents available in the meal planning system
 */
export const AgentInfoCard = () => {
  // Only include non-system agents
  const visibleAgents = Object.values(agentData).filter(
    (agent) => agent.id !== "system"
  );

  return (
    <Card className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-lg border-slate-200/70 dark:border-slate-800/70 overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <CardHeader className="pb-2 relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full filter blur-2xl transform group-hover:scale-110 transition-transform duration-500"></div>
        <Badge
          variant="outline"
          className="w-fit mb-2 text-xs font-semibold px-3 py-1 bg-indigo-50/90 backdrop-blur-md border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 relative"
        >
          POWERED BY LANGGRAPH
        </Badge>
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 relative">
          AI Planning Team
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground relative">
          Our planning system orchestrates specialized AI agents to create your
          perfect meal plan:
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="grid grid-cols-1 gap-3">
          {visibleAgents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center p-3 rounded-lg border ${agent.style.border} ${agent.style.bg} dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-md hover:scale-[1.02] transform`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${agent.style.iconBg} ${agent.style.text} shadow-inner`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {agent.icon}
                </svg>
              </div>
              <div className="flex-1 flex flex-col">
                <span className={`font-semibold text-sm ${agent.style.text}`}>
                  {agent.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {agent.id === "recipeSuggester"
                    ? "Recommends meals based on preferences and constraints"
                    : agent.id === "dietaryAdvisor"
                      ? "Provides nutritional guidance and accommodates dietary restrictions"
                      : agent.id === "groceryListBuilder"
                        ? "Compiles required ingredients for selected recipes"
                        : agent.id === "foodInventory"
                          ? "Tracks available ingredients and suggests using existing items"
                          : "Provides detailed recipes and cooking instructions"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-800/50 backdrop-blur-md">
          <p className="mb-1">
            Each agent specializes in a different aspect of meal planning,
            collaborating to provide a comprehensive solution.
          </p>
          <p>Coordinated through LangGraph&apos;s intelligent orchestration.</p>
        </div>
      </CardContent>
    </Card>
  );
};
