import React, { memo } from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/meal-planner";
import { getAgentInfo } from "@/data/meal-planner";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface MessageItemProps {
  message: Message;
}

/**
 * Renders a single message in the chat interface with enhanced formatting for AI responses
 */
const MessageItemComponent = ({ message }: MessageItemProps) => {
  const agentInfo = message.agent ? getAgentInfo(message.agent) : null;
  const isUserMessage = message.role === "user";

  // Define markdown components with proper TypeScript types
  const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => (
      <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
    h1: ({ children }) => (
      <h1 className="text-lg font-semibold mt-3 mb-2">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-md font-semibold mt-3 mb-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>
    ),
    // @ts-expect-error - The ReactMarkdown types don't fully match the actual props passed
    code: ({ inline, children, ...props }) => {
      if (inline) {
        return (
          <code
            className="px-1 py-0.5 rounded bg-slate-100 text-slate-800 text-xs font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      return (
        <pre className="p-3 rounded-md bg-slate-100 mb-2 overflow-x-auto">
          <code className="text-xs text-slate-800 font-mono" {...props}>
            {children}
          </code>
        </pre>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto mb-2">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
    tbody: ({ children }) => (
      <tbody className="divide-y divide-slate-100">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-3 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => <td className="px-3 py-2">{children}</td>,
  };

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
                agentInfo?.style.bg || "bg-white",
                agentInfo?.style.border || "border border-slate-200",
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
            {message.topic && (
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
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
          <div className="prose prose-slate prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
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
