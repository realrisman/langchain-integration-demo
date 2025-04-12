import { ReactNode } from "react";

// Agent types
export type AgentUpdate = {
  agent: string;
  content: string;
  topic?: string;
};

export type MealPlannerResponse = {
  threadId: string;
  updates: AgentUpdate[];
};

export type Message = {
  role: "user" | "agent";
  content: string;
  agent?: string;
  topic?: string;
  id?: string;
  timestamp?: Date;
};

export type AgentStyle = {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
};

export type AgentInfo = {
  id: string;
  name: string;
  icon: ReactNode;
  style: AgentStyle;
};
