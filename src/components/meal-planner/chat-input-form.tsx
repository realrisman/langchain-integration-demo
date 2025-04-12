import React from "react";
import type {
  FormEvent,
  KeyboardEvent,
  ChangeEvent,
  MutableRefObject,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

/**
 * Chat input form with text area and submit button
 */
interface ChatInputFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
  inputRef,
}) => {
  // Handle key press events
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow default behavior (new line) when Shift+Enter is pressed
        return;
      } else {
        // Prevent default behavior and submit form when only Enter is pressed
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-end gap-2">
      <div className="flex-1 relative">
        <Textarea
          // Using a ref callback to work around TypeScript limitations with ref types
          ref={(element) => {
            if (inputRef && element) {
              // This is a workaround for the type mismatch
              (inputRef as MutableRefObject<HTMLTextAreaElement>).current =
                element;
            }
          }}
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[54px] max-h-[160px] resize-y w-full focus-visible:ring-indigo-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-slate-200/70 dark:border-slate-700/70 shadow-sm rounded-lg"
          disabled={isLoading}
          aria-label="Chat message input"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className={`min-h-[54px] min-w-[54px] rounded-full p-3 shadow-md transition-all duration-300 
          ${
            isLoading || !inputValue.trim()
              ? "bg-indigo-400 dark:bg-indigo-700 opacity-70"
              : "bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg text-white dark:from-indigo-600 dark:to-purple-700"
          }`}
        aria-label="Send message"
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
        ) : (
          <SendHorizontal className="h-6 w-6" />
        )}
      </Button>
    </form>
  );
};
