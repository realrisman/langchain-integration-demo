import { MealPlannerResponse } from "@/types/meal-planner";

// Define update interface for agent responses
interface AgentUpdate {
  agent: string;
  content: string;
  topic?: string;
}

// Store message history for each thread
const messageHistoryByThread = new Map<
  string,
  Array<{ role: string; content: string; agent?: string; topic?: string }>
>();

/**
 * Service for interacting with the meal planner API
 */
export const MealPlannerService = {
  /**
   * Base URL for meal planner API
   */
  baseUrl: "/api/meal-planner",

  /**
   * Helper to safely abort a controller if it exists
   */
  safelyAbort(controller: AbortController | null): void {
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
  },

  /**
   * Sends a message to the meal planner API
   */
  async sendMessage(
    message: string,
    threadId: string | null,
    signal?: AbortSignal
  ): Promise<MealPlannerResponse> {
    try {
      // Check if signal is already aborted
      if (signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      // Prepare request body based on whether we have a threadId
      const requestBody = threadId ? { threadId, message } : { message };

      // Send request to API
      const response = await fetch(this.baseUrl, {
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

      // Parse the response
      const apiResponse = await response.json();

      // Store messages in history for this thread
      if (apiResponse.threadId) {
        // Initialize history array if this is a new thread
        if (!messageHistoryByThread.has(apiResponse.threadId)) {
          messageHistoryByThread.set(apiResponse.threadId, []);
        }

        // Add user message
        const history = messageHistoryByThread.get(apiResponse.threadId)!;
        history.push({ role: "user", content: message });

        // Add agent responses
        if (apiResponse.updates) {
          apiResponse.updates.forEach((update: AgentUpdate) => {
            history.push({
              role: "ai",
              content: update.content,
              agent: update.agent,
              topic: update.topic,
            });
          });
        }
      }

      return apiResponse;
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
  },

  /**
   * Resets the conversation history
   */
  resetConversation(threadId: string): void {
    if (messageHistoryByThread.has(threadId)) {
      messageHistoryByThread.delete(threadId);
    }
  },
};
