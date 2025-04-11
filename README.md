# LangChain Integration Demo

This project demonstrates a simple chatbot implementation using LangChain and OpenAI.

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your OpenAI API key:

   - Create a `.env.local` file at the root of the project
   - Add your OpenAI API key: `OPENAI_API_KEY=your_openai_api_key_here`

4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the chatbot

## Features

- Simple chat interface for interacting with an AI assistant
- Uses LangChain to manage conversation history and model interactions
- Built with Next.js and TypeScript

## Project Structure

- `src/app/page.tsx`: The main chatbot UI component
- `src/app/api/chat/route.ts`: API endpoint that uses LangChain to interact with OpenAI

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
