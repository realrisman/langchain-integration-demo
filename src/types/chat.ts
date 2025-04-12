/**
 * Message role type
 */
export type MessageRole = "user" | "assistant";

/**
 * Chat message structure
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: Date;
}
