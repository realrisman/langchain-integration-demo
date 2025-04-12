import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/meal-planner";
import { getAgentInfo } from "@/data/meal-planner";

interface MessageItemProps {
  message: Message;
}

/**
 * Renders a single message in the chat interface
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
          "max-w-[85%] rounded-xl shadow-sm p-4",
          isUserMessage
            ? "bg-blue-600 text-white rounded-tr-none"
            : cn(
                agentInfo?.style.bg || "",
                agentInfo?.style.border || "",
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
                "h-6 w-6 rounded-full mr-2 flex items-center justify-center",
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
          </div>
        )}
        <div className="whitespace-pre-line leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
};

MessageItemComponent.displayName = "MessageItem";

export const MessageItem = memo(MessageItemComponent);
