import React from "react";

/**
 * Displays a welcome message when the chat is empty
 */
export const EmptyChatState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
      <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full p-4 mb-4 backdrop-blur-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
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
      <h3 className="text-2xl font-medium text-gray-900 dark:text-gray-50 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        Welcome to Your Meal Planning Assistant
      </h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
        Ask questions about meal planning, recipes, nutrition advice, or help
        building a grocery list. I&apos;ll connect you with the right expert.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        <div className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
            🍽️ Plan a Week of Meals
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;Create a 7-day meal plan focused on Mediterranean diet&rdquo;
          </p>
        </div>
        <div className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
            🥗 Dietary Preferences
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;I need gluten-free dinner recipes for a family of four&rdquo;
          </p>
        </div>
        <div className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
            🛒 Create Shopping List
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            &ldquo;Make a grocery list for a vegetarian taco night&rdquo;
          </p>
        </div>
        <div className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
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
