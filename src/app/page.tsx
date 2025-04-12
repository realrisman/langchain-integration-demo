import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Types
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionElement: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
};

type TechStackItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badges: { text: string; colorClass: string }[];
};

// UI Components
const FeatureCard = ({
  icon,
  title,
  description,
  actionElement,
  iconBgClass,
  iconTextClass,
}: FeatureCardProps) => (
  <Card className="border-none shadow-md">
    <CardHeader className="pb-2">
      <div
        className={`w-12 h-12 ${iconBgClass} rounded-full flex items-center justify-center ${iconTextClass} mb-4`}
      >
        {icon}
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="pb-4">
      <CardDescription className="text-gray-600">{description}</CardDescription>
    </CardContent>
    <CardFooter>{actionElement}</CardFooter>
  </Card>
);

const TechStackItem = ({
  icon,
  title,
  description,
  badges,
}: TechStackItemProps) => (
  <HoverCard>
    <HoverCardTrigger asChild>
      <div className="text-center p-6 cursor-pointer transition-all hover:bg-gray-50 rounded-lg">
        <div
          className={`w-16 h-16 bg-${title.toLowerCase()}-50 rounded-full flex items-center justify-center text-${title.toLowerCase()}-600 mx-auto mb-4`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="text-sm">
          {description}{" "}
          {title === "LangChain"
            ? "designed to leverage the capabilities of LLMs through composable components."
            : title === "LangSmith"
            ? "providing enhanced observability and insights."
            : "enabling complex AI workflows and agent interactions through graph structures."}
        </p>
        <div className="flex items-center pt-2 flex-wrap gap-2">
          {badges.map((badge, index) => (
            <Badge key={index} className={badge.colorClass}>
              {badge.text}
            </Badge>
          ))}
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
);

// Hero section
const HeroSection = () => (
  <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
    <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
      <Badge
        variant="outline"
        className="text-blue-100 border-blue-300 mb-4 px-3 py-1 text-sm"
      >
        LANGCHAIN INTEGRATION DEMO
      </Badge>
      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6 tracking-tight">
        AI-Powered Assistants with LangChain
      </h1>
      <p className="text-xl max-w-3xl mb-10 text-blue-100 leading-relaxed">
        Explore the power of LangChain, LangSmith, and LangGraph through
        interactive demos featuring a chatbot and an intelligent meal planning
        system.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="text-blue-700 font-medium"
        >
          <Link href="/chatbot">Try the Chatbot</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="default"
          className="bg-blue-700 hover:bg-blue-800 font-medium"
        >
          <Link href="/meal-planner">Try the Meal Planner</Link>
        </Button>
      </div>
    </div>
  </header>
);

// Feature section
const FeaturesSection = () => {
  // Feature card data
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
      title: "AI Chatbot",
      description:
        "Interactive chatbot built with LangChain and OpenAI that can answer your questions and engage in conversation.",
      actionElement: (
        <Button asChild variant="link" className="pl-0">
          <Link href="/chatbot">
            Try it out
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </Button>
      ),
      iconBgClass: "bg-blue-100",
      iconTextClass: "text-blue-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      title: "Meal Planning",
      description:
        "Multi-agent system that helps plan meals, suggests recipes, and builds grocery lists based on your preferences.",
      actionElement: (
        <Button asChild variant="link" className="pl-0">
          <Link href="/meal-planner">
            Try it out
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </Button>
      ),
      iconBgClass: "bg-green-100",
      iconTextClass: "text-green-600",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "LangSmith Integration",
      description:
        "Complete observability and debugging for AI applications with detailed traces and analytics.",
      actionElement: (
        <Badge variant="secondary" className="text-gray-500">
          Implemented Behind the Scenes
        </Badge>
      ),
      iconBgClass: "bg-purple-100",
      iconTextClass: "text-purple-600",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Project Features
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Discover the powerful capabilities of this LangChain integration demo
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              actionElement={feature.actionElement}
              iconBgClass={feature.iconBgClass}
              iconTextClass={feature.iconTextClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Tech stack section
const TechStackSection = () => {
  // Tech stack data
  const techItems = [
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
      description:
        "Framework for developing applications powered by language models",
      badges: [
        {
          text: "Chains",
          colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        },
        {
          text: "Agents",
          colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        },
        {
          text: "Memory",
          colorClass: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        },
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: "LangSmith",
      description:
        "Platform for debugging, testing, evaluating, and monitoring LLM applications",
      badges: [
        {
          text: "Tracing",
          colorClass: "bg-green-100 text-green-800 hover:bg-green-100",
        },
        {
          text: "Debugging",
          colorClass: "bg-green-100 text-green-800 hover:bg-green-100",
        },
        {
          text: "Analytics",
          colorClass: "bg-green-100 text-green-800 hover:bg-green-100",
        },
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
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
      title: "LangGraph",
      description:
        "Library for building stateful, multi-actor applications with LLMs",
      badges: [
        {
          text: "Agents",
          colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        },
        {
          text: "Workflows",
          colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        },
        {
          text: "Graph",
          colorClass: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        },
      ],
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Powered by Modern AI Technologies
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
          This project showcases how to build intelligent applications using the
          latest AI development tools and frameworks.
        </p>
        <Separator className="mb-12 max-w-md mx-auto" />

        <div className="grid md:grid-cols-3 gap-8">
          {techItems.map((item, index) => (
            <TechStackItem
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              badges={item.badges}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Footer component
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12 mt-auto">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="mb-4">LangChain Integration Demo</p>
      <Separator className="mb-4 max-w-xs mx-auto bg-gray-800" />
      <p className="text-gray-400 text-sm">
        Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
      </p>
    </div>
  </footer>
);

// Main page component
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <Footer />
    </div>
  );
}
