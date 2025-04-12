import { Bot } from "lucide-react";

/**
 * LoadingIndicator - Shows a typing animation when the chatbot is processing a message
 */
export const LoadingIndicator = () => {
  return (
    <div className="flex gap-3" data-animate-message>
      {/* Avatar */}
      <div className="flex-shrink-0 rounded-full h-10 w-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center shadow-sm">
        <Bot size={20} />
      </div>

      {/* Message content */}
      <div className="rounded-2xl py-3 px-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex items-center gap-2 max-w-[85%] border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex gap-1.5">
          <span
            className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
          <span
            className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "600ms" }}
          ></span>
        </div>
        <span className="text-gray-600 dark:text-gray-400 ml-1">
          Thinking...
        </span>
      </div>
    </div>
  );
};
