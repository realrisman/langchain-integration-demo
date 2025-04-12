# LangChain, LangSmith, and LangGraph Integration Demo

This is a Next.js application that demonstrates integration with LangChain, LangSmith, and LangGraph - a suite of tools for developing applications powered by language models. It features a simple AI chatbot and a conversational meal planning system powered by a multi-agent architecture.

## Features

- Interactive AI chatbot using LangChain and OpenAI
- Multi-agent meal planning system using LangGraph
- LangSmith integration for observability, debugging, and optimization
- Modern UI with Tailwind CSS and shadcn/ui components
- Server components architecture with NextJS App Router

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [LangChain](https://js.langchain.com/docs/)
- [LangGraph](https://langchain-ai.github.io/langgraphjs/)
- [LangSmith](https://smith.langchain.com/)
- [OpenAI API](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── (app)/            # Application routes
│   ├── (home)/           # Home page routes
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/           # React components
├── data/                 # Data models and constants
├── lib/                  # Utilities and services
│   ├── agents/           # LangGraph agent implementations
│   │   ├── meal-planning-agents.ts    # Specialized meal planning agents
│   │   └── meal-planning-graph.ts     # Agent orchestration graph
│   ├── api/              # API utilities
│   └── services/         # Service layer
├── store/                # State management
└── types/                # TypeScript type definitions
```

## Multi-Agent Meal Planning System

The meal planning system leverages LangGraph to orchestrate a conversation between specialized agents:

- **RecipeSuggester**: Recommends meals based on preferences and constraints
- **DietaryAdvisor**: Provides nutritional guidance and accommodates dietary restrictions
- **GroceryListBuilder**: Compiles required ingredients for selected recipes
- **FoodInventory**: Tracks available ingredients and suggests using existing items

## Code Architecture

The codebase follows these principles:

- **React Server Components**: Leveraging Next.js RSC for performance
- **Modular Components**: Small, focused components with single responsibilities
- **Custom Hooks**: Extracting stateful logic into reusable hooks
- **Service Layer Pattern**: Separating business logic from UI components
- **Multi-Agent Architecture**: Using LangGraph for orchestrating complex AI workflows
- **Observability**: LangSmith integration for tracing and debugging AI interactions
- **Proper Error Handling**: Comprehensive error handling at every layer
- **Type Safety**: Full TypeScript implementation with proper interface definitions

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- LangSmith API key (free account at https://smith.langchain.com/)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/langchain-integration-demo.git
   cd langchain-integration-demo
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   OPENAI_API_KEY=your_openai_api_key
   LANGCHAIN_API_KEY=your_langsmith_api_key
   LANGCHAIN_PROJECT=your_langsmith_project_name
   LANGCHAIN_ENDPOINT=https://api.smith.langchain.com
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Guidelines

- Follow the established component patterns when adding new features
- Create new components in the appropriate directories
- Use custom hooks for shared stateful logic
- Implement proper error handling
- Write useful comments and documentation
- Follow the TypeScript patterns established in the codebase
- Use LangSmith for debugging and tracing complex agent interactions

## License

[MIT](LICENSE)
