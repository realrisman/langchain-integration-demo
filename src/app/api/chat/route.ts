import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Ensure OpenAI API key is set
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Initialize the ChatOpenAI model
    const chatModel = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    // Convert messages to LangChain format
    const langChainMessages = messages.map((message: ChatMessage) => {
      if (message.role === "user") {
        return new HumanMessage(message.content);
      } else {
        return new AIMessage(message.content);
      }
    });

    // Generate a response
    const response = await chatModel.invoke(langChainMessages);

    return NextResponse.json({ response: response.content });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
