import React from "react";

/**
 * Displays a welcome message when the chat is empty
 */
export const EmptyChatState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-center">
      <div className="bg-blue-100 text-blue-500 rounded-full p-4 mb-4">
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
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        Welcome to your Meal Planning Assistant
      </h3>
      <p className="text-gray-500 max-w-md">
        Ask questions about meal planning, recipes, nutrition advice, or help
        building a grocery list. I&apos;ll connect you with the right expert.
      </p>
    </div>
  );
};
