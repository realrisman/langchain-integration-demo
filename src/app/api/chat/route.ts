import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createApiError, createErrorResponse } from "@/lib/api/errors";
import { generateChatResponse, ChatResponse } from "@/lib/api/langchain";

/**
 * Request validation schema
 */
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(10000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
});

/**
 * Handles the chat API request
 */
export async function POST(req: NextRequest) {
  try {
    // Validate the request body
    const body = await req.json().catch(() => {
      throw createApiError("validation", "Invalid JSON in request body");
    });

    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      throw createApiError(
        "validation",
        `Invalid request format: ${validationResult.error.message}`
      );
    }

    const { messages } = validationResult.data;

    // Generate response using the langchain utility
    const responseContent = await generateChatResponse(messages);

    // Return successful response
    return NextResponse.json({
      response: responseContent,
    } as ChatResponse);
  } catch (error) {
    return createErrorResponse(error);
  }
}
