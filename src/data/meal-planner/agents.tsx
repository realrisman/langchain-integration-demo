import React from "react";
import { AgentInfo } from "@/types/meal-planner";

/**
 * Agent configuration data for the meal planner system
 */
const agentData: Record<string, AgentInfo> = {
  recipeSuggester: {
    id: "recipeSuggester",
    name: "Recipe Suggester",
    icon: (
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    ),
    style: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
  },
  dietaryAdvisor: {
    id: "dietaryAdvisor",
    name: "Dietary Advisor",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 11-6 0 3 3 0 016 0zm-1 9a4 4 0 00-4 4h8a4 4 0 00-4-4z"
        clipRule="evenodd"
      />
    ),
    style: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-700",
      iconBg: "bg-blue-100",
    },
  },
  groceryListBuilder: {
    id: "groceryListBuilder",
    name: "Grocery List Builder",
    icon: (
      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    ),
    style: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    },
  },
  foodInventory: {
    id: "foodInventory",
    name: "Food Inventory",
    icon: (
      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    ),
    style: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-700",
      iconBg: "bg-purple-100",
    },
  },
  system: {
    id: "system",
    name: "System",
    icon: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    ),
    style: {
      bg: "bg-gray-50",
      border: "border-gray-100",
      text: "text-gray-700",
      iconBg: "bg-gray-100",
    },
  },
};

/**
 * Returns the agent info for a given agent ID, or system if not found
 */
export const getAgentInfo = (agentId?: string): AgentInfo => {
  return agentId && agentData[agentId] ? agentData[agentId] : agentData.system;
};

export default agentData;
