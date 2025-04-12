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

// Zustand store types
export interface MealPlannerState {
  messages: Message[];
  threadId: string | null;
  currentTopic: string | null;
  isLoading: boolean;
  inputValue: string;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setThreadId: (threadId: string | null) => void;
  setCurrentTopic: (topic: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setInputValue: (value: string) => void;
  reset: () => void;
}
