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

// Custom error types for better error handling
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

// Main API handler
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

    // Ensure OpenAI API key is set
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new ConfigError("OpenAI API key is not configured");
    }

    // Initialize the ChatOpenAI model
    const chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    // Convert messages to LangChain format
    const langChainMessages = messages.map((message) => {
      if (message.role === "user") {
        return new HumanMessage(message.content);
      } else {
        return new AIMessage(message.content);
      }
    });

    // Generate a response
    const response = await chatModel.invoke(langChainMessages);

    return NextResponse.json({ response: response.content });
  } catch (error) {
    console.error("Error in chat API:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
