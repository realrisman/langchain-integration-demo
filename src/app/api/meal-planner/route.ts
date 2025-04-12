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
      const threadId = crypto.randomUUID();
      const threadConfig = createThreadConfig();

      // Store thread config for future requests
      activeThreads.set(threadId, threadConfig);

      // Process the user input
      const updates = await processMealPlannerInput(
        graph,
        body.message,
        threadConfig
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

      // Get the thread configuration
      const threadConfig = activeThreads.get(body.threadId);

      if (!threadConfig) {
        throw createApiError(
          "validation",
          "Thread not found. Please start a new conversation.",
          404
        );
      }

      // Create a command to resume the conversation
      const command = new Command({
        resume: body.message,
      });

      // Process the user input
      const updates = await processMealPlannerInput(
        graph,
        command,
        threadConfig
      );

      // Return response with updates
      return NextResponse.json({
        threadId: body.threadId,
        updates,
      });
    }
  } catch (error) {
    return createErrorResponse(error);
  }
}
