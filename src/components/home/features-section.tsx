import {
  Bot,
  CookingPot,
  BarChart,
  GitMerge,
  Network,
  Zap,
} from "lucide-react";

/**
 * Features section component for the home page
 */
export function FeaturesSection() {
  return (
    <div id="features" className="py-24 sm:py-32 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Discover What This Project Offers
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            This project demonstrates the integration of LangChain, LangSmith,
            and LangGraph through practical implementations of AI-powered
            applications.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600/10 dark:bg-blue-500/10">
                    <feature.icon
                      className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-4 text-sm">
                    <a
                      href={feature.href}
                      className="font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 sm:mt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              Project Components
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Built with Modern AI Technologies
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projectComponents.map((component) => (
              <div
                key={component.name}
                className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-4 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 dark:bg-blue-500/10">
                    <component.icon
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="ml-4 text-lg font-semibold text-gray-900 dark:text-white">
                    {component.name}
                  </h3>
                </div>
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {component.description}
                </p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  {component.technology}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: "LangChain Integration",
    description:
      "Utilizes LangChain.js to build LLM-powered applications. Demonstrates chat models, prompt engineering, memory management, and more.",
    icon: Zap,
    href: "/chatbot",
  },
  {
    name: "LangSmith Observability",
    description:
      "Implements LangSmith for detailed tracing, monitoring, and debugging of AI applications. Gain insights into model performance and chain execution.",
    icon: BarChart,
    href: "/dashboard",
  },
  {
    name: "Multi-Agent System",
    description:
      "Showcases a sophisticated meal planning system built with LangGraph, featuring specialized agents that collaborate to provide personalized meal recommendations.",
    icon: Network,
    href: "/meal-planner",
  },
];

const projectComponents = [
  {
    name: "Simple Chatbot",
    description:
      "An AI assistant that can answer questions and maintain conversation context using LangChain and OpenAI.",
    technology: "Built with LangChain.js and OpenAI",
    icon: Bot,
  },
  {
    name: "Meal Planning System",
    description:
      "A multi-agent system that suggests meals based on preferences, dietary restrictions, and available ingredients.",
    technology: "Powered by LangGraph and specialized AI agents",
    icon: CookingPot,
  },
  {
    name: "LangSmith Integration",
    description:
      "Full tracing and debugging capabilities for all AI interactions, with detailed logs and performance metrics.",
    technology: "Using LangSmith API for observability",
    icon: GitMerge,
  },
];
