import { Library, Code, Server, Flame } from "lucide-react";

export function TechStackSection() {
  return (
    <div className="py-24 sm:py-32 bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Technology Stack
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Built With Modern Technologies
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            This project leverages cutting-edge AI and web development
            technologies to create a powerful and intuitive user experience.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {techCategories.map((category) => (
              <div key={category.name} className="flex flex-col">
                <div className="flex items-center gap-x-3 mb-6">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                    <category.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                <ul className="mt-2 space-y-4">
                  {category.technologies.map((tech) => (
                    <li key={tech.name} className="flex gap-x-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600/10 dark:bg-blue-500/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {tech.name}
                        </span>
                        {tech.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {tech.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const techCategories = [
  {
    name: "AI Framework",
    icon: Flame,
    technologies: [
      {
        name: "LangChain",
        description: "Open-source framework for LLM applications",
      },
      {
        name: "LangGraph",
        description: "Library for stateful, multi-agent applications",
      },
      { name: "LangSmith", description: "Debugging and monitoring platform" },
      { name: "OpenAI API", description: "Powerful language models" },
    ],
  },
  {
    name: "Frontend",
    icon: Code,
    technologies: [
      { name: "Next.js", description: "React framework with SSR support" },
      { name: "TypeScript", description: "Type-safe JavaScript" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Shadcn UI", description: "Component library" },
    ],
  },
  {
    name: "Backend",
    icon: Server,
    technologies: [
      { name: "Node.js", description: "JavaScript runtime environment" },
      { name: "API Routes", description: "Next.js serverless functions" },
      { name: "Vercel", description: "Deployment platform" },
    ],
  },
  {
    name: "Libraries",
    icon: Library,
    technologies: [
      { name: "Lucide Icons", description: "Beautiful SVG icons" },
      { name: "Zod", description: "TypeScript-first schema validation" },
      { name: "Zustand", description: "State management" },
    ],
  },
];
