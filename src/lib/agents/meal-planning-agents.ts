import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import { MessagesAnnotation, Command, interrupt } from "@langchain/langgraph";

const model = new ChatOpenAI({ model: "gpt-4o" });

/**
 * Call LLM with structured output to get a response and target agent
 */
function callLlm(messages: BaseMessage[], targetAgentNodes: string[]) {
  // Define schema for structured output
  const outputSchema = z.object({
    response: z
      .string()
      .describe(
        "A human readable response to the query. Will be streamed back to the user."
      ),
    goto: z
      .enum(["finish", ...targetAgentNodes])
      .describe(
        "The next agent to call, or 'finish' if the user's query has been resolved."
      ),
  });

  return model
    .withStructuredOutput(outputSchema, { name: "Response" })
    .invoke(messages);
}

/**
 * Recipe Suggester Agent
 * Recommends meals based on preferences and constraints
 */
export async function recipeSuggester(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
    "You are a recipe expert that can recommend meals based on user preferences, dietary needs, and available ingredients. " +
    "If you need specific dietary advice, ask 'dietaryAdvisor' for help. " +
    "If you need to create a grocery list, ask 'groceryListBuilder' for help. " +
    "If you need to check available ingredients, ask 'foodInventory' for help. " +
    "If you have enough information to respond to the user, return 'finish'. " +
    "Never mention other agents by name to the user.";

  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ] as BaseMessage[];
  const targetAgentNodes = [
    "dietaryAdvisor",
    "groceryListBuilder",
    "foodInventory",
  ];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "recipeSuggester",
  };

  let goto = response.goto;
  if (goto === "finish") {
    goto = "human";
  }

  return new Command({ goto, update: { messages: [aiMsg] } });
}

/**
 * Dietary Advisor Agent
 * Provides nutritional guidance and accommodates dietary restrictions
 */
export async function dietaryAdvisor(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
    "You are a nutrition expert that can provide dietary advice based on health goals and restrictions. " +
    "If you need meal recommendations, ask 'recipeSuggester' for help. " +
    "If you need to create a grocery list, ask 'groceryListBuilder' for help. " +
    "If you need to check available ingredients, ask 'foodInventory' for help. " +
    "If you have enough information to respond to the user, return 'finish'. " +
    "Never mention other agents by name to the user.";

  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ] as BaseMessage[];
  const targetAgentNodes = [
    "recipeSuggester",
    "groceryListBuilder",
    "foodInventory",
  ];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "dietaryAdvisor",
  };

  let goto = response.goto;
  if (goto === "finish") {
    goto = "human";
  }

  return new Command({ goto, update: { messages: [aiMsg] } });
}

/**
 * Grocery List Builder Agent
 * Compiles required ingredients for selected recipes
 */
export async function groceryListBuilder(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
    "You are a grocery expert that can create shopping lists based on recipes and meal plans. " +
    "If you need meal recommendations, ask 'recipeSuggester' for help. " +
    "If you need dietary advice, ask 'dietaryAdvisor' for help. " +
    "If you need to check available ingredients, ask 'foodInventory' for help. " +
    "If you have enough information to respond to the user, return 'finish'. " +
    "Never mention other agents by name to the user.";

  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ] as BaseMessage[];
  const targetAgentNodes = [
    "recipeSuggester",
    "dietaryAdvisor",
    "foodInventory",
  ];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "groceryListBuilder",
  };

  let goto = response.goto;
  if (goto === "finish") {
    goto = "human";
  }

  return new Command({ goto, update: { messages: [aiMsg] } });
}

/**
 * Food Inventory Agent
 * Tracks available ingredients and suggests using existing items
 */
export async function foodInventory(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
    "You are an inventory manager that tracks available ingredients and suggests using existing items. " +
    "If you need meal recommendations, ask 'recipeSuggester' for help. " +
    "If you need dietary advice, ask 'dietaryAdvisor' for help. " +
    "If you need to create a grocery list, ask 'groceryListBuilder' for help. " +
    "If you have enough information to respond to the user, return 'finish'. " +
    "Never mention other agents by name to the user.";

  const messages = [
    { role: "system", content: systemPrompt },
    ...state.messages,
  ] as BaseMessage[];
  const targetAgentNodes = [
    "recipeSuggester",
    "dietaryAdvisor",
    "groceryListBuilder",
  ];
  const response = await callLlm(messages, targetAgentNodes);
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "foodInventory",
  };

  let goto = response.goto;
  if (goto === "finish") {
    goto = "human";
  }

  return new Command({ goto, update: { messages: [aiMsg] } });
}

/**
 * Human Node
 * Collects user input and routes to the active agent
 */
export function humanNode(state: typeof MessagesAnnotation.State): Command {
  const userInput: string = interrupt("Ready for user input.");

  let activeAgent: string | undefined = undefined;

  // Look up the active agent
  for (let i = state.messages.length - 1; i >= 0; i--) {
    if (state.messages[i].name) {
      activeAgent = state.messages[i].name;
      break;
    }
  }

  if (!activeAgent) {
    throw new Error("Could not determine the active agent.");
  }

  return new Command({
    goto: activeAgent,
    update: {
      messages: [
        {
          role: "human",
          content: userInput,
        },
      ],
    },
  });
}
