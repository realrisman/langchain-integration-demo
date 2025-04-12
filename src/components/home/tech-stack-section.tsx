import { Separator } from "@/components/ui/separator";
import { TechStackItem } from "./tech-stack-item";

/**
 * Tech stack data type
 */
type TechStackData = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badges: { text: string; colorClass: string }[];
};

/**
 * Tech stack section component displaying the technologies used
 */
export const TechStackSection = () => {
  // Tech stack data
  const techStack: TechStackData[] = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "LangChain",
      description: "Framework for building applications with LLMs",
      badges: [
        { text: "Chains", colorClass: "bg-blue-100 text-blue-800" },
        { text: "LLMs", colorClass: "bg-blue-100 text-blue-800" },
        { text: "Memory", colorClass: "bg-blue-100 text-blue-800" },
        { text: "Agents", colorClass: "bg-blue-100 text-blue-800" },
      ],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "LangSmith",
      description: "Platform for debugging and monitoring LLM applications",
      badges: [
        { text: "Tracing", colorClass: "bg-green-100 text-green-800" },
        { text: "Evaluation", colorClass: "bg-green-100 text-green-800" },
        { text: "Testing", colorClass: "bg-green-100 text-green-800" },
      ],
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      title: "LangGraph",
      description: "Library for building stateful, multi-actor applications",
      badges: [
        { text: "Workflows", colorClass: "bg-purple-100 text-purple-800" },
        {
          text: "State Management",
          colorClass: "bg-purple-100 text-purple-800",
        },
        { text: "Agents", colorClass: "bg-purple-100 text-purple-800" },
      ],
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Powered by LangChain Ecosystem
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Built with the latest tools from the LangChain ecosystem for
            developing LLM-powered applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {techStack.map((tech, index) => (
            <TechStackItem key={index} {...tech} />
          ))}
        </div>

        <div className="mt-16">
          <Separator className="mb-8" />
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Start Building with LangChain
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Explore our demos to understand how LangChain components can be
              integrated to create powerful AI applications.
            </p>
            <div className="inline-flex items-center justify-center">
              <a
                href="https://js.langchain.com/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View Documentation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
