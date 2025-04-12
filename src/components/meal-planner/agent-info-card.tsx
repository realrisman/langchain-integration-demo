import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { agentData } from "@/data/meal-planner";

/**
 * Displays information about the specialized agents available in the meal planning system
 */
export const AgentInfoCard = () => {
  // Only include non-system agents
  const visibleAgents = Object.values(agentData).filter(
    (agent) => agent.id !== "system"
  );

  return (
    <Card className="mb-6 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-gray-800">
          Meal Planning Assistant
        </CardTitle>
        <CardDescription>
          Our assistant uses multiple specialized agents to help with meal
          planning:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleAgents.map((agent) => (
            <div
              key={agent.id}
              className={cn(
                "flex items-center p-3 rounded-lg border",
                agent.style.bg,
                agent.style.border
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center mr-3",
                  agent.style.iconBg
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("h-5 w-5", agent.style.text)}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  {agent.icon}
                </svg>
              </div>
              <span className={cn("font-medium", agent.style.text)}>
                {agent.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
