import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/meal-planner";
import { getAgentInfo } from "@/data/meal-planner";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";

interface MessageItemProps {
  message: Message;
}

/**
 * Renders a single message in the chat interface with enhanced formatting for AI responses
 */
const MessageItemComponent = ({ message }: MessageItemProps) => {
  const agentInfo = message.agent ? getAgentInfo(message.agent) : null;
  const isUserMessage = message.role === "user";

  return (
    <div
      className={cn("flex", isUserMessage ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-xl shadow-sm p-4 backdrop-blur-sm",
          isUserMessage
            ? "bg-indigo-600/90 text-white rounded-tr-none"
            : cn(
                agentInfo?.style.bg || "bg-white/90 dark:bg-slate-800/90",
                agentInfo?.style.border ||
                  "border border-slate-200/80 dark:border-slate-700/80",
                "rounded-tl-none"
              )
        )}
        role="listitem"
        aria-label={`${isUserMessage ? "Your" : agentInfo?.name || "System"} message`}
      >
        {message.role === "agent" && message.agent && agentInfo && (
          <div className={cn("flex items-center mb-2", agentInfo.style.text)}>
            <div
              className={cn(
                "h-6 w-6 rounded-full mr-2 flex items-center justify-center backdrop-blur-sm",
                agentInfo.style.iconBg
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                {agentInfo.icon}
              </svg>
            </div>
            <span className="text-sm font-medium">{agentInfo.name}</span>
            {message.topic && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100/80 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 backdrop-blur-sm">
                {message.topic}
              </span>
            )}
          </div>
        )}

        {/* Message content with enhanced formatting for AI responses */}
        {isUserMessage ? (
          <div className="whitespace-pre-line leading-relaxed">
            {message.content}
          </div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Timestamp if available */}
        {message.timestamp && (
          <div className="mt-1 text-xs text-right opacity-70">
            {new Intl.DateTimeFormat("en-US", {
              hour: "numeric",
              minute: "numeric",
            }).format(message.timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

MessageItemComponent.displayName = "MessageItem";

export const MessageItem = memo(MessageItemComponent);
