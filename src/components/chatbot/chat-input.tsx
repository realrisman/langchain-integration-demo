"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export function ChatInput({
  input,
  setInput,
  isLoading,
  onSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus input on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 160);
      textarea.style.height = `${newHeight}px`;
    };

    textarea.addEventListener("input", adjustHeight);
    adjustHeight(); // Initial adjustment

    return () => {
      textarea.removeEventListener("input", adjustHeight);
    };
  }, [input]);

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 px-4 z-10">
      <form
        onSubmit={onSubmit}
        className="flex gap-3 w-full max-w-3xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50 p-4 transition-all duration-200 ease-in-out hover:shadow-2xl"
      >
        {/* Custom styled textarea container */}
        <div className="relative flex-1 min-h-10 group">
          <div className="w-full min-h-[40px] max-h-[160px] overflow-y-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Shift + Enter for new line)"
              className="w-full min-h-[40px] bg-transparent border-none shadow-none outline-none resize-none p-0 text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-inherit leading-relaxed"
              disabled={isLoading}
              rows={1}
              style={{
                fontFamily: "inherit",
                fontSize: "0.9375rem",
              }}
            />
          </div>
          {/* Subtle gradient border animation on focus */}
          <div className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-500 rounded-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-70"></div>
        </div>
        <div className="flex flex-col justify-end">
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full w-11 h-11 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-500 dark:hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>

      {/* Keyboard hint */}
      <div className="flex justify-center mt-3">
        <div className="hidden md:flex items-center text-gray-500 dark:text-gray-400 text-xs gap-1 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-[10px]">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 font-mono text-[10px]">
            Enter
          </kbd>
          <span>for a new line</span>
        </div>
      </div>
    </div>
  );
}
