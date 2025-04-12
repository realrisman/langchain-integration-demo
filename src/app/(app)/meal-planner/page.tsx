"use client";

import { useEffect, useRef } from "react";
import {
  MealPlannerLayout,
  MealPlannerContent,
} from "@/components/meal-planner";
import {
  useMealPlannerStore,
  useMealPlannerActions,
} from "@/store/meal-planner";

export default function MealPlannerPage() {
  const { messages, inputValue, setInputValue, isLoading } =
    useMealPlannerStore();

  const { handleSubmit, cancelRequest } = useMealPlannerActions();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending requests
      cancelRequest();
    };
  }, [cancelRequest]);

  return (
    <MealPlannerLayout>
      <MealPlannerContent
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
      />
    </MealPlannerLayout>
  );
}
