import { Message, MessageRole } from "@/components/chatbot/message-bubble";

// Types
export type ChatAPIRequest = {
  messages: {
    role: MessageRole;
    content: string;
  }[];
};

export type ChatAPIResponse = {
  response: string;
  error?: string;
};

/**
 * Service for handling chat-related API requests
 */
export const ChatService = {
  /**
   * Sends user messages to the API and returns the AI response
   */
  async sendMessage(messages: Message[]): Promise<string> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.map(({ role, content }) => ({ role, content })),
        } as ChatAPIRequest),
      });

      const data = (await response.json()) as ChatAPIResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      return data.response;
    } catch (error) {
      console.error("Error in chat service:", error);
      throw error;
    }
  },
};
