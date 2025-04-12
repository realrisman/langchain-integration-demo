# LangChain Integration Demo

This is a Next.js application that demonstrates integration with LangChain, a framework for developing applications powered by language models. It features an AI chatbot and a meal planning system.

## Features

- Interactive AI chatbot using LangChain and OpenAI
- Multi-agent meal planning system
- Modern UI with Tailwind CSS and shadcn/ui components
- Server components architecture with NextJS App Router

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [LangChain](https://js.langchain.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── chatbot/          # Chatbot page
│   ├── meal-planner/     # Meal planner page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── chatbot/          # Chatbot-specific components
│   ├── home/             # Home page components
│   └── ui/               # UI components (shadcn)
└── lib/                  # Utilities and services
    ├── api/              # API utilities
    └── services/         # Service layer
```

## Code Architecture

The codebase follows these principles:

- **React Server Components**: Leveraging Next.js RSC for performance
- **Modular Components**: Small, focused components with single responsibilities
- **Custom Hooks**: Extracting stateful logic into reusable hooks
- **Service Layer Pattern**: Separating business logic from UI components
- **Proper Error Handling**: Comprehensive error handling at every layer
- **Type Safety**: Full TypeScript implementation with proper interface definitions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

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

## License

[MIT](LICENSE)
