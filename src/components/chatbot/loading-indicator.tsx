import { Loader2, Bot } from "lucide-react";

/**
 * LoadingIndicator - Shows a typing animation when the chatbot is processing a message
 */
export const LoadingIndicator = () => {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0 rounded-full p-2 bg-gray-100 text-gray-600">
        <Bot size={20} />
      </div>

      {/* Message content */}
      <div className="rounded-2xl py-2 px-3 bg-gray-100 text-gray-800 flex items-center gap-2 max-w-[80%]">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <span className="text-gray-600">Thinking...</span>
      </div>
    </div>
  );
};
