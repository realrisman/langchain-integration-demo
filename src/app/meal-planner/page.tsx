"use client";

import { useState, useRef, useEffect } from "react";

type AgentUpdate = {
  agent: string;
  content: string;
};

type MealPlannerResponse = {
  threadId: string;
  updates: AgentUpdate[];
};

export default function MealPlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "agent"; content: string; agent?: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isLoading) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setIsLoading(true);

    try {
      // Prepare request body
      const requestBody = threadId
        ? { threadId, message: inputValue }
        : { message: inputValue };

      // Send request to API
      const response = await fetch("/api/meal-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
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
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: update.content,
            agent: update.agent,
          },
        ]);
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content:
            "Sorry, there was an error processing your request. Please try again.",
          agent: "system",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInputValue("");
    }
  };

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)]">
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Meal Planning Assistant</h1>
          <p className="text-gray-600">
            Our assistant uses multiple specialized agents to help with meal
            planning:
          </p>
          <ul className="list-disc list-inside mt-2 ml-4 space-y-1 text-sm">
            <li className="text-emerald-600">
              Recipe Suggester - recommends meals based on preferences
            </li>
            <li className="text-blue-600">
              Dietary Advisor - provides nutritional guidance
            </li>
            <li className="text-amber-600">
              Grocery List Builder - compiles required ingredients
            </li>
            <li className="text-purple-600">
              Food Inventory - tracks available ingredients
            </li>
          </ul>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="mb-2">
                    Start a conversation with the meal planning assistant.
                  </p>
                  <p className="text-sm">
                    Try: &quot;I need help planning meals for the week&quot; or
                    &quot;I&apos;m looking for healthy dinner recipes&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : message.agent === "recipeSuggester"
                          ? "bg-emerald-100 rounded-tl-none"
                          : message.agent === "dietaryAdvisor"
                          ? "bg-blue-100 rounded-tl-none"
                          : message.agent === "groceryListBuilder"
                          ? "bg-amber-100 rounded-tl-none"
                          : message.agent === "foodInventory"
                          ? "bg-purple-100 rounded-tl-none"
                          : "bg-gray-100 rounded-tl-none"
                      }`}
                    >
                      {message.role === "agent" && message.agent && (
                        <div
                          className={`text-xs mb-1 font-medium ${
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
                          {message.agent === "recipeSuggester"
                            ? "Recipe Suggester"
                            : message.agent === "dietaryAdvisor"
                            ? "Dietary Advisor"
                            : message.agent === "groceryListBuilder"
                            ? "Grocery List Builder"
                            : message.agent === "foodInventory"
                            ? "Food Inventory"
                            : "System"}
                        </div>
                      )}
                      <div className="whitespace-pre-line">
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
            <div className="flex">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 border rounded-l-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "Send"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
