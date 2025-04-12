import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useRef, useCallback } from "react";
import type { FormEvent } from "react";
import { MealPlannerState } from "@/types/meal-planner";
import { MealPlannerService } from "@/lib/services/meal-planner-service";

/**
 * Zustand store for meal planner state management
 */
export const useMealPlannerStore = create<MealPlannerState>((set) => ({
  messages: [],
  threadId: null,
  currentTopic: null,
  isLoading: false,
  inputValue: "",

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: message.id || uuidv4(),
          timestamp: message.timestamp || new Date(),
        },
      ],
    })),

  setThreadId: (threadId) => set({ threadId }),

  setCurrentTopic: (currentTopic) => set({ currentTopic }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setInputValue: (inputValue) => set({ inputValue }),

  reset: () =>
    set({
      messages: [],
      threadId: null,
      currentTopic: null,
      inputValue: "",
    }),
}));

/**
 * Custom hook for meal planner actions
 */
export const useMealPlannerActions = () => {
  const {
    addMessage,
    setThreadId,
    setCurrentTopic,
    setIsLoading,
    currentTopic,
    threadId,
    setInputValue,
    inputValue,
    isLoading,
  } = useMealPlannerStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoize cancelRequest to avoid dependency changes in useEffect
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      MealPlannerService.safelyAbort(abortControllerRef.current);
      abortControllerRef.current = null;
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Store the input value before clearing it
    const messageText = inputValue.trim();

    // Add user message to chat
    addMessage({
      role: "user",
      content: messageText,
      topic: currentTopic || undefined,
    });

    // Clear input immediately for better UX
    setInputValue("");
    setIsLoading(true);

    // Cancel any existing request
    cancelRequest();

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const data = await MealPlannerService.sendMessage(
        messageText,
        threadId,
        signal
      );

      // Only proceed if the request wasn't aborted
      if (!signal.aborted) {
        // Store thread ID for future requests
        if (!threadId && data.threadId) {
          setThreadId(data.threadId);
        }

        // Add agent responses to chat
        data.updates.forEach((update) => {
          // Update the current topic if provided
          if (update.topic) {
            setCurrentTopic(update.topic);
          }

          addMessage({
            role: "agent",
            content: update.content,
            agent: update.agent,
            topic: update.topic,
          });
        });
      }
    } catch (error) {
      // Check if this is an abort error (which we expect and can ignore)
      const isAbortError =
        error instanceof Error &&
        (error.name === "AbortError" ||
          (error instanceof DOMException && error.name === "AbortError"));

      if (!isAbortError && !signal.aborted) {
        console.error("Error:", error);

        addMessage({
          role: "agent",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          agent: "system",
        });
      }
    } finally {
      // Clean up regardless of outcome
      if (abortControllerRef.current?.signal === signal) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };

  return {
    handleSubmit,
    cancelRequest,
  };
};
