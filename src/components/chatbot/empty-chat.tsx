import { MessageSquare, Sparkles, Zap } from "lucide-react";
import { useChatStore } from "@/store/chat-store";

/**
 * EmptyChat - Displays an engaging welcome screen when there are no messages yet
 */
export const EmptyChat = () => (
  <div className="flex flex-col items-center justify-center h-full overflow-y-auto py-8">
    <div className="w-full max-w-2xl mx-auto text-center px-4">
      {/* Main heading */}
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
        Welcome to your AI Assistant
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
        Ask me anything and I&apos;ll provide intelligent responses powered by
        LangChain and OpenAI.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <FeatureCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="Natural Conversations"
          description="Chat naturally with context-aware AI"
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5" />}
          title="Instant Responses"
          description="Get immediate, accurate answers"
        />
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title="Helpful Information"
          description="Receive detailed insights and explanations"
        />
      </div>

      {/* Suggested prompts */}
      <div className="text-left mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Try asking:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SuggestedPrompt text="What is LangChain and how does it work?" />
          <SuggestedPrompt text="Can you explain how large language models process text?" />
          <SuggestedPrompt text="What are some common LLM use cases?" />
          <SuggestedPrompt text="How do AI agents communicate with each other?" />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Type a message below to start chatting
      </p>
    </div>
  </div>
);

/**
 * Feature card component for highlighting key capabilities
 */
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm transition-all">
    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4 text-blue-600 dark:text-blue-400">
      {icon}
    </div>
    <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
      {title}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
      {description}
    </p>
  </div>
);

/**
 * Suggested prompt component for quick-start examples
 */
const SuggestedPrompt = ({ text }: { text: string }) => (
  <button
    className="cursor-pointer text-left p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 w-full"
    onClick={() => {
      const { setInput } = useChatStore.getState();
      setInput(text);

      const textareaElement = document.querySelector(
        'textarea[placeholder*="Type your message"]'
      ) as HTMLTextAreaElement;
      if (textareaElement) {
        textareaElement.focus();
      }
    }}
  >
    {text}
  </button>
);
