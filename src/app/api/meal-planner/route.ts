import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Command } from "@langchain/langgraph";
import { createApiError, createErrorResponse } from "@/lib/api/errors";
import {
  createMealPlanningGraph,
  createThreadConfig,
  processMealPlannerInput,
} from "@/lib/agents/meal-planning-graph";

// Define message type for enhanced control
type Message = { role: string; content: string; name?: string; topic?: string };

// Keep a map of all messages by thread ID
const messagesByThread = new Map<string, Message[]>();

// Keep a map of active thread configurations
const activeThreads = new Map<string, ReturnType<typeof createThreadConfig>>();

// Keep track of active AbortControllers for each thread
const activeAbortControllers = new Map<string, AbortController>();

// Keep track of the last active agent for each thread
const activeAgents = new Map<string, string>();

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

      // Store the last agent that responded for future requests
      if (updates.length > 0) {
        activeAgents.set(threadId, updates[updates.length - 1].agent);
      }

      // Store the complete conversation for this thread
      const messages: Message[] = [
        { role: "user", content: body.message },
        ...updates.map((update) => ({
          role: "ai",
          content: update.content,
          name: update.agent,
          topic: update.topic,
        })),
      ];

      // Save message history for thread
      messagesByThread.set(threadId, messages);

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
          "Thread not found. Please start a new conversation."
        );
      }

      // Get existing conversation history
      const existingMessages = messagesByThread.get(threadId) || [];

      // Add new user message
      const newUserMessage: Message = { role: "user", content: body.message };
      const allMessages = [...existingMessages, newUserMessage];

      // Determine the last active agent from previous responses for this thread
      let lastAgent = "recipeSuggester"; // Default fallback

      // Get the last active agent from our tracking map
      const storedAgent = activeAgents.get(threadId);
      if (storedAgent) {
        lastAgent = storedAgent;
      }

      // Create a command that includes ALL previous messages and routes to the right agent
      const command = new Command({
        goto: lastAgent,
        update: {
          messages: allMessages.map((msg) => {
            // Transform message format if needed
            return {
              role: msg.role,
              content: msg.content,
              ...(msg.name ? { name: msg.name } : {}),
              ...(msg.topic ? { topic: msg.topic } : {}),
            };
          }),
        },
      });

      // Process the user input with signal
      const updates = await processMealPlannerInput(
        graph,
        command,
        threadConfig,
        signal
      );

      // Update the last agent that responded
      if (updates.length > 0) {
        activeAgents.set(threadId, updates[updates.length - 1].agent);

        // Add agent responses to conversation history
        updates.forEach((update) => {
          allMessages.push({
            role: "ai",
            content: update.content,
            name: update.agent,
            topic: update.topic,
          });
        });

        // Update stored message history
        messagesByThread.set(threadId, allMessages);
      }

      // Return response with updates
      return NextResponse.json({
        threadId,
        updates,
      });
    }
  } catch (error) {
    // If error is due to abort, return a 499 Client Closed Request
    if (error instanceof Error && error.name === "AbortError") {
      return new NextResponse("Client closed request", { status: 499 });
    }

    return createErrorResponse(error);
  } finally {
    // Clean up if request completes or errors
    if (threadId) {
      activeAbortControllers.delete(threadId);
      // Don't delete from activeAgents or messagesByThread to maintain context between sessions
    }
  }
}
