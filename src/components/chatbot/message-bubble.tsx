import { formatDistanceToNow } from "date-fns";
import { Bot, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ChatMessage } from "@/types/chat";

/**
 * Props for the MessageBubble component
 */
interface MessageBubbleProps {
  message: ChatMessage;
}

/**
 * Component that renders a message bubble for chat conversations
 */
export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { role, content, timestamp } = message;
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      data-animate-message
    >
      {/* Avatar */}
      <div
        className={`h-10 w-10 flex items-center justify-center flex-shrink-0 rounded-full shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
            : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300"
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      {/* Message content */}
      <div
        className={`rounded-2xl py-3 px-4 max-w-[85%] shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-line">{content}</div>
        ) : (
          <MarkdownRenderer
            content={content}
            className={`prose-sm max-w-none ${isUser ? "prose-invert" : ""}`}
          />
        )}

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 flex items-center ${
            isUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <span className="inline-block">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};
