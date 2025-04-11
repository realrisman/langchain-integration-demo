import { Bot } from "lucide-react";

/**
 * EmptyChat - Displays a placeholder when there are no messages yet
 */
export const EmptyChat = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-4">
    <div className="p-8 bg-blue-50 rounded-full mb-6">
      <Bot className="h-12 w-12 text-blue-500" />
    </div>
    <div>
      <p className="text-xl font-medium mb-2 text-gray-700">
        Start a conversation
      </p>
      <p className="text-gray-500 max-w-sm mx-auto">
        Ask a question or start a conversation with the AI assistant.
      </p>
    </div>
  </div>
);
