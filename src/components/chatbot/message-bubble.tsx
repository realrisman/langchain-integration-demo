import { formatDistanceToNow } from "date-fns";
import { Bot, User } from "lucide-react";

/**
 * Message role type
 */
export type MessageRole = "user" | "assistant";

/**
 * Message structure
 */
export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

/**
 * Props for the MessageBubble component
 */
interface MessageBubbleProps {
  message: Message;
}

/**
 * Component that renders a message bubble for chat conversations
 */
export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { role, content, timestamp } = message;
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full ${
          isUser ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message content */}
      <div
        className={`rounded-2xl py-2 px-3 max-w-[80%] ${
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="prose">
          {content.split("\n").map((line, i) => (
            <p key={i} className={`m-0 ${i > 0 ? "mt-4" : ""}`}>
              {line}
            </p>
          ))}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-blue-200" : "text-gray-500"
          }`}
        >
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};
