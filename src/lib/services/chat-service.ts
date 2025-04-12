import { ChatMessage, MessageRole } from "@/types/chat";

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
   * Base URL for chat API
   */
  baseUrl: "/api/chat",

  /**
   * Formats messages for the API request
   */
  formatMessagesForAPI(messages: ChatMessage[]): ChatAPIRequest {
    return {
      messages: messages.map(({ role, content }) => ({ role, content })),
    };
  },

  /**
   * Sends user messages to the API and returns the AI response
   */
  async sendMessage(messages: ChatMessage[]): Promise<string> {
    try {
      if (!messages.length) {
        throw new Error("No messages to send");
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.formatMessagesForAPI(messages)),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ChatAPIResponse;
        throw new Error(
          errorData.error || `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = (await response.json()) as ChatAPIResponse;
      return data.response;
    } catch (error) {
      console.error("Error in chat service:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get response: ${error.message}`);
      }
      throw new Error("Failed to get response from AI service");
    }
  },
};
