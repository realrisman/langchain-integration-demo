import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createApiError, createErrorResponse } from "@/lib/api/errors";
import { generateChatResponse, ChatResponse } from "@/lib/api/langchain";

// Schema validation
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

/**
 * Handles the chat API request
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request
    const body = await req.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      throw createApiError(
        "validation",
        "Invalid request format: " + validationResult.error.message
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
