import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useRef, useCallback } from "react";
import type { FormEvent } from "react";
import { MealPlannerState, MealPlannerResponse } from "@/types/meal-planner";

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
 * Helper to safely abort a controller if it exists
 */
const safelyAbort = (controller: AbortController | null) => {
  // Only abort if controller exists and signal is not already aborted
  if (controller && !controller.signal.aborted) {
    try {
      controller.abort();
    } catch (e) {
      // Ignore AbortError - this is expected when aborting
      if (e instanceof Error && e.name !== "AbortError") {
        console.error("Error aborting controller:", e);
      }
    }
  }
};

/**
 * Sends a message to the meal planner API
 */
export const sendMessage = async (
  message: string,
  threadId: string | null,
  signal?: AbortSignal
): Promise<MealPlannerResponse> => {
  try {
    // Check if signal is already aborted
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    // Prepare request body based on whether we have a threadId
    const requestBody = threadId ? { threadId, message } : { message };

    // Send request to API
    const response = await fetch("/api/meal-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal,
    });

    // Check for aborted signal again after fetch
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    if (!response.ok) {
      // Special handling for 499 status (client closed request)
      if (response.status === 499) {
        throw new DOMException("Request aborted", "AbortError");
      }

      const error = new Error(`API error: ${response.statusText}`);
      error.name = "ApiError";
      throw error;
    }

    return await response.json();
  } catch (error) {
    // Handle AbortError separately
    if (
      error instanceof Error &&
      (error.name === "AbortError" ||
        (error instanceof DOMException && error.name === "AbortError"))
    ) {
      // Create a standardized abort error
      const abortError = new DOMException("Request aborted", "AbortError");
      throw abortError;
    }

    // Rethrow other errors
    throw error;
  }
};

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
      safelyAbort(abortControllerRef.current);
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
      const data = await sendMessage(messageText, threadId, signal);

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
