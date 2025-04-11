import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation
const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

/**
 * Type definitions for API request and response
 */
type ChatMessage = z.infer<typeof messageSchema>;
type ChatResponse = {
  response: string;
};
type ErrorResponse = {
  error: string;
};

/**
 * Custom error types for better error handling
 */
class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

class ConfigError extends ApiError {
  constructor(message: string) {
    super(message, 500);
    this.name = "ConfigError";
  }
}

class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Initializes and returns the LangChain chat model
 * @throws {ConfigError} If API key is not configured
 */
const createChatModel = (): ChatOpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new ConfigError("OpenAI API key is not configured");
  }

  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });
};

/**
 * Converts API message format to LangChain message format
 */
const convertToLangChainMessages = (messages: ChatMessage[]) => {
  return messages.map((message) =>
    message.role === "user"
      ? new HumanMessage(message.content)
      : new AIMessage(message.content)
  );
};

/**
 * Handles the API request to generate chat responses
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request
    const body = await req.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      throw new ValidationError(
        "Invalid request format: " + validationResult.error.message
      );
    }

    const { messages } = validationResult.data;

    // Initialize the model and generate response
    const chatModel = createChatModel();
    const langChainMessages = convertToLangChainMessages(messages);
    const response = await chatModel.invoke(langChainMessages);

    // Return successful response
    return NextResponse.json({
      response: response.content,
    } as ChatResponse);
  } catch (error) {
    console.error("Error in chat API:", error);

    // Handle known error types
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message } as ErrorResponse, {
        status: error.status,
      });
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: "Failed to process chat request" } as ErrorResponse,
      { status: 500 }
    );
  }
}
