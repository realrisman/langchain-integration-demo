import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

// Types
export type MessageRole = "user" | "assistant";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// Helper function to format time
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Chat Avatar component
export const ChatAvatar = ({ role }: { role: MessageRole }) => (
  <Avatar
    className={
      role === "user"
        ? "h-8 w-8 bg-blue-100 text-blue-600 border border-blue-200"
        : "h-8 w-8 bg-indigo-100 text-indigo-600 border border-indigo-200"
    }
  >
    <AvatarImage
      src={
        role === "user" ? "/images/user-avatar.svg" : "/images/ai-avatar.svg"
      }
      alt={role === "user" ? "User" : "AI Assistant"}
    />
    <AvatarFallback className="text-xs">
      {role === "user" ? (
        <User className="h-4 w-4" />
      ) : (
        <Bot className="h-4 w-4" />
      )}
    </AvatarFallback>
  </Avatar>
);

// Message Bubble component
export const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[80%] ${
          message.role === "user" ? "flex-row-reverse" : "flex-row"
        } gap-3`}
      >
        <ChatAvatar role={message.role} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">
              {message.role === "user" ? "You" : "AI Assistant"}
            </span>
            <span>•</span>
            <time dateTime={message.timestamp.toISOString()}>
              {formatTime(message.timestamp)}
            </time>
          </div>
          <div
            className={`p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            } shadow-sm`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};
