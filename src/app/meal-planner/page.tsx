"use client";

import { useState, useRef, useEffect } from "react";

type AgentUpdate = {
  agent: string;
  content: string;
  topic?: string;
};

type MealPlannerResponse = {
  threadId: string;
  updates: AgentUpdate[];
};

export default function MealPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    {
      role: "user" | "agent";
      content: string;
      agent?: string;
      topic?: string;
    }[]
  >([]);
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up event listeners to cancel requests when user leaves
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };

    // Only add the beforeunload event listener (removes visibilitychange)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Abort any pending requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputValue, topic: currentTopic || undefined },
    ]);
    setIsLoading(true);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Prepare request body
      const requestBody = threadId
        ? { threadId, message: inputValue }
        : { message: inputValue };

      // Send request to API with abort signal
      const response = await fetch("/api/meal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response from meal planner");
      }

      const data: MealPlannerResponse = await response.json();

      // Store thread ID for future requests
      if (!threadId && data.threadId) {
        setThreadId(data.threadId);
      }

      // Add agent responses to chat
      data.updates.forEach((update) => {
        // Update the current topic if provided
        if (update.topic) {
          setCurrentTopic(update.topic);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: update.content,
            agent: update.agent,
            topic: update.topic,
          },
        ]);
      });
    } catch (error) {
      console.error("Error:", error);
      // Only add error message if the request wasn't aborted
      if (error instanceof Error && error.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content:
              "Sorry, there was an error processing your request. Please try again.",
            agent: "system",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            Meal Planning Assistant
          </h1>
          <p className="text-gray-600">
            Our assistant uses multiple specialized agents to help with meal
            planning:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <span className="text-emerald-700 font-medium">
                Recipe Suggester
              </span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 11-6 0 3 3 0 016 0zm-1 9a4 4 0 00-4 4h8a4 4 0 00-4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-blue-700 font-medium">Dietary Advisor</span>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <span className="text-amber-700 font-medium">
                Grocery List Builder
              </span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <span className="text-purple-700 font-medium">
                Food Inventory
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 border rounded-xl overflow-hidden flex flex-col bg-white shadow-sm">
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center max-w-md mx-auto">
                  <div className="mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="mb-2 font-medium text-lg">
                    Start a conversation with the meal planning assistant
                  </p>
                  <p className="text-sm px-8">
                    Try: &quot;I need help planning meals for the week&quot; or
                    &quot;I&apos;m looking for healthy dinner recipes&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl shadow-sm p-4 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : message.agent === "recipeSuggester"
                          ? "bg-emerald-50 border border-emerald-100 rounded-tl-none"
                          : message.agent === "dietaryAdvisor"
                          ? "bg-blue-50 border border-blue-100 rounded-tl-none"
                          : message.agent === "groceryListBuilder"
                          ? "bg-amber-50 border border-amber-100 rounded-tl-none"
                          : message.agent === "foodInventory"
                          ? "bg-purple-50 border border-purple-100 rounded-tl-none"
                          : "bg-gray-50 border border-gray-100 rounded-tl-none"
                      }`}
                    >
                      {message.role === "agent" && message.agent && (
                        <div
                          className={`flex items-center mb-2 ${
                            message.agent === "recipeSuggester"
                              ? "text-emerald-700"
                              : message.agent === "dietaryAdvisor"
                              ? "text-blue-700"
                              : message.agent === "groceryListBuilder"
                              ? "text-amber-700"
                              : message.agent === "foodInventory"
                              ? "text-purple-700"
                              : "text-gray-700"
                          }`}
                        >
                          <div
                            className={`h-6 w-6 rounded-full mr-2 flex items-center justify-center ${
                              message.agent === "recipeSuggester"
                                ? "bg-emerald-100"
                                : message.agent === "dietaryAdvisor"
                                ? "bg-blue-100"
                                : message.agent === "groceryListBuilder"
                                ? "bg-amber-100"
                                : message.agent === "foodInventory"
                                ? "bg-purple-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              {message.agent === "recipeSuggester" && (
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              )}
                              {message.agent === "dietaryAdvisor" && (
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 11-6 0 3 3 0 016 0zm-1 9a4 4 0 00-4 4h8a4 4 0 00-4-4z"
                                  clipRule="evenodd"
                                />
                              )}
                              {message.agent === "groceryListBuilder" && (
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              )}
                              {message.agent === "foodInventory" && (
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              )}
                              {![
                                "recipeSuggester",
                                "dietaryAdvisor",
                                "groceryListBuilder",
                                "foodInventory",
                              ].includes(message.agent) && (
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                  clipRule="evenodd"
                                />
                              )}
                            </svg>
                          </div>
                          <span className="text-sm font-medium">
                            {message.agent === "recipeSuggester"
                              ? "Recipe Suggester"
                              : message.agent === "dietaryAdvisor"
                              ? "Dietary Advisor"
                              : message.agent === "groceryListBuilder"
                              ? "Grocery List Builder"
                              : message.agent === "foodInventory"
                              ? "Food Inventory"
                              : "System"}
                          </span>
                        </div>
                      )}
                      <div className="whitespace-pre-line leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (e.shiftKey) {
                        // Allow default behavior (new line) when Shift+Enter is pressed
                        return;
                      } else {
                        // Prevent default behavior and submit form when only Enter is pressed
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }
                  }}
                  placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                  className="flex-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 min-h-[42px] max-h-[160px] resize-y"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white min-h-[42px] px-4 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    Processing
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                        clipRule="evenodd"
                        transform="rotate(180, 10, 10)"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
