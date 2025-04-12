import React from "react";

/**
 * Displays a welcome message when the chat is empty
 */
export interface EmptyChatStateProps {
  setInputValue?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  setInputValue,
  inputRef,
}) => {
  const handleExampleClick = (text: string) => {
    if (setInputValue) {
      setInputValue(text);

      // Focus the input after a short delay to ensure the value is set
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 10);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center relative animate-fade-up animate-duration-500">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-6 -right-6 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-100/30 dark:bg-purple-900/20 rounded-full filter blur-2xl"></div>
      </div>

      <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-300 rounded-full p-5 mb-6 backdrop-blur-md shadow-md relative z-10 animate-pulse animate-duration-[3000ms] animate-infinite">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </div>
      <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 relative z-10">
        Welcome to Your Meal Planning Assistant
      </h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-8 relative z-10">
        Ask questions about meal planning, recipes, nutrition advice, or help
        building a grocery list. I&apos;ll connect you with the right expert.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg relative z-10">
        <div
          onClick={() =>
            handleExampleClick(
              "Create a 7-day meal plan focused on Mediterranean diet"
            )
          }
          className="text-left p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/60 shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            🍽️ Plan a Week of Meals
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;Create a 7-day meal plan focused on Mediterranean diet&rdquo;
          </p>
        </div>
        <div
          onClick={() =>
            handleExampleClick(
              "I need gluten-free dinner recipes for a family of four"
            )
          }
          className="text-left p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/60 shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            🥗 Dietary Preferences
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;I need gluten-free dinner recipes for a family of four&rdquo;
          </p>
        </div>
        <div
          onClick={() =>
            handleExampleClick(
              "Make a grocery list for a vegetarian taco night"
            )
          }
          className="text-left p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/60 shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            🛒 Create Shopping List
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;Make a grocery list for a vegetarian taco night&rdquo;
          </p>
        </div>
        <div
          onClick={() =>
            handleExampleClick(
              "What can I cook with chicken, broccoli, and rice?"
            )
          }
          className="text-left p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/60 shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            👨‍🍳 Recipe Ideas
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;What can I cook with chicken, broccoli, and rice?&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
