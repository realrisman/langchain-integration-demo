import { CheckCircle2 } from "lucide-react";

/**
 * Implementation steps component for the home page
 */
export function ImplementationSteps() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Project Implementation
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How We Built This Demo
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Our implementation follows a structured approach to demonstrate key
            features of LangChain, LangSmith, and LangGraph through practical
            examples.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
            {steps.map((step, index) => (
              <li key={index} className="mb-10 ml-6">
                <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                </span>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mb-4 text-base text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
                {step.substeps && (
                  <ul className="space-y-2 list-disc list-inside text-gray-500 dark:text-gray-400">
                    {step.substeps.map((substep, subIndex) => (
                      <li key={subIndex}>{substep}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Account Setup",
    description:
      "Set up the necessary accounts for accessing the required APIs and services.",
    substeps: [
      "Created a free LangSmith account at https://smith.langchain.com/",
      "Created a free OpenAI account for API access",
    ],
  },
  {
    title: "Basic Chatbot Implementation",
    description: "Implemented a simple chatbot using LangChain and OpenAI.",
    substeps: [
      "Used LangChain to invoke the model and manage conversation history",
      "Created a user-friendly interface for chatbot interactions",
      "Implemented based on the reference implementation from LangChain's documentation",
    ],
  },
  {
    title: "LangSmith Integration",
    description:
      "Configured the project to send traces to LangSmith for monitoring and debugging.",
    substeps: [
      "Set up LangSmith API keys and configuration",
      "Implemented trace logging for all AI interactions",
      "Created a dashboard to visualize and analyze the performance data",
    ],
  },
  {
    title: "Multi-Agent System Development",
    description:
      "Created a sophisticated meal planning system with multiple specialized agents.",
    substeps: [
      "RecipeSuggester: Recommends meals based on preferences and constraints",
      "DietaryAdvisor: Provides nutritional guidance and accommodates dietary restrictions",
      "GroceryListBuilder: Compiles required ingredients for selected recipes",
      "FoodInventory: Tracks available ingredients and suggests using existing items",
    ],
  },
];
