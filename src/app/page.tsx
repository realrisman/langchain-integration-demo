import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl mb-6">
            AI-Powered Assistants with LangChain
          </h1>
          <p className="text-xl max-w-3xl mb-10 text-blue-100">
            Explore the power of LangChain, LangSmith, and LangGraph through
            interactive demos featuring a chatbot and an intelligent meal
            planning system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/chatbot"
              className="bg-white text-blue-700 hover:bg-blue-50 font-medium rounded-full px-8 py-3 text-lg transition-colors shadow-md"
            >
              Try the Chatbot
            </Link>
            <Link
              href="#coming-soon"
              className="bg-blue-700 text-white border border-blue-400 hover:bg-blue-800 font-medium rounded-full px-8 py-3 text-lg transition-colors shadow-md"
            >
              Meal Planning (Coming Soon)
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            Project Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
              </div>
              <h3 className="text-xl font-bold mb-3">AI Chatbot</h3>
              <p className="text-gray-600 mb-4">
                Interactive chatbot built with LangChain and OpenAI that can
                answer your questions and engage in conversation.
              </p>
              <Link
                href="/chatbot"
                className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center"
              >
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
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
              </div>
              <h3 className="text-xl font-bold mb-3">Meal Planning</h3>
              <p className="text-gray-600 mb-4">
                Multi-agent system that helps plan meals, suggests recipes, and
                builds grocery lists based on your preferences.
              </p>
              <span className="text-gray-400 font-medium inline-flex items-center">
                Coming Soon
              </span>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
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
              </div>
              <h3 className="text-xl font-bold mb-3">LangSmith Integration</h3>
              <p className="text-gray-600 mb-4">
                Complete observability and debugging for AI applications with
                detailed traces and analytics.
              </p>
              <span className="text-gray-400 font-medium inline-flex items-center">
                Implemented Behind the Scenes
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Powered by Modern AI Technologies
          </h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
            This project showcases how to build intelligent applications using
            the latest AI development tools and frameworks.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* LangChain */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
              </div>
              <h3 className="text-xl font-bold mb-2">LangChain</h3>
              <p className="text-gray-600">
                Framework for developing applications powered by language
                models, designed to leverage the capabilities of LLMs.
              </p>
            </div>

            {/* LangSmith */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
              </div>
              <h3 className="text-xl font-bold mb-2">LangSmith</h3>
              <p className="text-gray-600">
                Platform for debugging, testing, evaluating, and monitoring LLM
                applications, providing enhanced observability.
              </p>
            </div>

            {/* LangGraph */}
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
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
              </div>
              <h3 className="text-xl font-bold mb-2">LangGraph</h3>
              <p className="text-gray-600">
                Library for building stateful, multi-actor applications with
                LLMs, enabling complex AI workflows and agent interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-4">LangChain Integration Demo</p>
          <p className="text-gray-400 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
