import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { createApiError, createErrorResponse } from "@/lib/api/errors";
import {
  createMealPlanningGraph,
  createThreadConfig,
  processMealPlannerInput,
} from "@/lib/agents/meal-planning-graph";

// Keep a map of active thread configurations
const activeThreads = new Map<string, ReturnType<typeof createThreadConfig>>();

// Keep track of active AbortControllers for each thread
const activeAbortControllers = new Map<string, AbortController>();

// Schema validation for initial request
const initialRequestSchema = z.object({
  message: z.string().min(1),
});

// Schema validation for follow-up requests
const followUpRequestSchema = z.object({
  threadId: z.string().uuid(),
  message: z.string().min(1),
});

/**
 * Handles the meal planner API request
 */
export async function POST(req: NextRequest) {
  // Create an AbortController to handle client disconnection
  const controller = new AbortController();
  const { signal } = controller;

  // Handle client disconnection (only when page is fully closed)
  req.signal.addEventListener("abort", () => {
    // When request is aborted, it means the page was fully closed
    controller.abort();
    console.log("Request aborted - page was closed");
  });

  let threadId: string | null = null;

  try {
    // Parse request body
    const body = await req.json();

    // Initialize graph
    const graph = createMealPlanningGraph();

    // Check if this is a new conversation or continuation
    if (!body.threadId) {
      // Validate initial request
      const validationResult = initialRequestSchema.safeParse(body);

      if (!validationResult.success) {
        throw createApiError(
          "validation",
          "Invalid request format: " + validationResult.error.message
        );
      }

      // Create a new thread configuration
      threadId = crypto.randomUUID();
      const threadConfig = createThreadConfig();

      // Store thread config for future requests
      activeThreads.set(threadId, threadConfig);

      // Store the controller for this thread
      activeAbortControllers.set(threadId, controller);

      // Process the user input with signal
      const updates = await processMealPlannerInput(
        graph,
        body.message,
        threadConfig,
        signal
      );

      // Return response with thread ID and updates
      return NextResponse.json({
        threadId,
        updates,
      });
    } else {
      // Validate follow-up request
      const validationResult = followUpRequestSchema.safeParse(body);

      if (!validationResult.success) {
        throw createApiError(
          "validation",
          "Invalid request format: " + validationResult.error.message
        );
      }

      // Set threadId - at this point we know it's a valid string from the validation
      threadId = body.threadId as string;

      // Cancel any existing operation on this thread
      const existingController = activeAbortControllers.get(threadId);
      if (existingController) {
        existingController.abort();
        activeAbortControllers.delete(threadId);
      }

      // Store the new controller
      activeAbortControllers.set(threadId, controller);

      // Get the thread configuration
      const threadConfig = activeThreads.get(threadId);

      if (!threadConfig) {
        throw createApiError(
          "validation",
          "Thread not found. Please start a new conversation.",
          404
        );
      }

      // Create a command to resume the conversation
      const command = new Command({
        resume: {
          messages: [{ role: "user", content: body.message }],
        },
      });

      // Process the user input with signal
      const updates = await processMealPlannerInput(
        graph,
        command,
        threadConfig,
        signal
      );

      // Return response with updates
      return NextResponse.json({
        threadId,
        updates,
      });
    }
  } catch (error) {
    // If error is due to abort, return a 499 Client Closed Request
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`Request aborted for thread: ${threadId}`);
      return new NextResponse("Client closed request", { status: 499 });
    }

    return createErrorResponse(error);
  } finally {
    // Clean up if request completes or errors
    if (threadId) {
      activeAbortControllers.delete(threadId);
    }
  }
}
