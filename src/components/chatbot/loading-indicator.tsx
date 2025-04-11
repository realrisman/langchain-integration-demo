import { Loader2 } from "lucide-react";
import { ChatAvatar, formatTime } from "./message-bubble";

/**
 * LoadingIndicator - Shows a typing animation when the chatbot is processing a message
 */
export const LoadingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="flex max-w-[80%] flex-row gap-3">
        <ChatAvatar role="assistant" />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">AI Assistant</span>
            <span>•</span>
            <time dateTime={new Date().toISOString()}>
              {formatTime(new Date())}
            </time>
          </div>
          <div className="p-3 rounded-lg bg-gray-100 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-gray-500">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
