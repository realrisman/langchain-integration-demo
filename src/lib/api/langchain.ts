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
};

/**
 * Initializes and returns the LangChain chat model
 */
export const createChatModel = (
  modelName = "gpt-3.5-turbo",
  temperature = 0.7
): ChatOpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw createApiError("configuration", "OpenAI API key is not configured");
  }

  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName,
    temperature,
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
 * Generates a chat response from the given messages
 */
export const generateChatResponse = async (
  messages: ChatMessage[],
  modelName?: string,
  temperature?: number
): Promise<string> => {
  const chatModel = createChatModel(modelName, temperature);
  const langChainMessages = convertToLangChainMessages(messages);
  const response = await chatModel.invoke(langChainMessages);

  // Handle various content types that might be returned by LangChain
  const content = response.content;
  if (typeof content === "string") {
    return content;
  } else if (Array.isArray(content)) {
    // Join complex message content if it's an array
    return content
      .map((item) =>
        typeof item === "object" && item !== null
          ? JSON.stringify(item)
          : String(item)
      )
      .join(" ");
  } else {
    // Fallback for any other type
    return String(content);
  }
};
