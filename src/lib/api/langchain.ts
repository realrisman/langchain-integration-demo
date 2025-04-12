import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { createApiError } from "./errors";

/**
 * Message type definition
 */
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Response type for chat API
 */
export type ChatResponse = {
  response: string;
  error?: string;
};

/**
 * Configuration options for the chat model
 */
export interface ChatModelConfig {
  modelName?: string;
  temperature?: number;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: ChatModelConfig = {
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
};

/**
 * Initializes and returns the LangChain chat model
 */
export const createChatModel = (
  config: ChatModelConfig = DEFAULT_CONFIG
): ChatOpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw createApiError("configuration", "OpenAI API key is not configured");
  }

  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: config.modelName || DEFAULT_CONFIG.modelName,
    temperature: config.temperature || DEFAULT_CONFIG.temperature,
  });
};

/**
 * Converts API message format to LangChain message format
 */
export const convertToLangChainMessages = (messages: ChatMessage[]) => {
  return messages.map((message) =>
    message.role === "user"
      ? new HumanMessage(message.content)
      : new AIMessage(message.content)
  );
};

/**
 * Formats the LangChain response content to a string
 */
export const formatResponseContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    // Join complex message content if it's an array
    return content
      .map((item) =>
        typeof item === "object" && item !== null
          ? JSON.stringify(item)
          : String(item)
      )
      .join(" ");
  }

  // Fallback for any other type
  return String(content);
};

/**
 * Generates a chat response from the given messages
 */
export const generateChatResponse = async (
  messages: ChatMessage[],
  config?: ChatModelConfig
): Promise<string> => {
  try {
    const chatModel = createChatModel(config);
    const langChainMessages = convertToLangChainMessages(messages);
    const response = await chatModel.invoke(langChainMessages);
    return formatResponseContent(response.content);
  } catch (error) {
    console.error("Error generating chat response:", error);
    if (error instanceof Error) {
      throw createApiError("external_api", `LangChain error: ${error.message}`);
    }
    throw createApiError(
      "server",
      "Unknown error occurred while generating response"
    );
  }
};
