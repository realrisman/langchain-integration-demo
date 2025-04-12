import React from "react";
import type { FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/**
 * Chat input form with text area and submit button
 */
interface ChatInputFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isLoading: boolean;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
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
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
      <div className="flex-1 relative">
        <Textarea
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          className="min-h-[42px] max-h-[160px] resize-y w-full"
          disabled={isLoading}
          aria-label="Chat message input"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !inputValue.trim()}
        className="min-h-[42px]"
        aria-label="Send message"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="sr-only">Processing</span>
            Processing
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
                transform="rotate(180, 10, 10)"
              />
            </svg>
            <span className="sr-only">Send</span>
          </span>
        )}
      </Button>
    </form>
  );
};
