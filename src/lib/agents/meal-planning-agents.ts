import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { BaseMessage } from "@langchain/core/messages";
import { MessagesAnnotation, Command, interrupt } from "@langchain/langgraph";

const model = new ChatOpenAI({ model: "gpt-4o" });

/**
 * Call LLM with structured output to get a response and target agent
 */
function callLlm(
  messages: BaseMessage[],
  targetAgentNodes: string[],
  agentName: string
) {
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
        "The next agent to call, or 'finish' if the user's query has been resolved. Must choose the most appropriate agent based on the user's query and conversation context."
      ),
    topic: z
      .string()
      .optional()
      .describe(
        "The main topic being discussed (e.g., 'salmon recipe', 'vegetarian diet', 'weekly meal plan')"
      ),
  });

  // Create enhanced system prompt with context awareness
  const enhancedSystemPrompt = `You are a ${agentName} responding to users in a meal planning system.
  
IMPORTANT ROUTING INSTRUCTIONS:
1. You MUST determine if the user's message is best handled by you or should be routed to another agent:
   - For diet questions or weight loss strategies → Route to "dietaryAdvisor"
   - For specific recipe details or meal suggestions → Route to "recipeSuggester"
   - For shopping lists or ingredient planning → Route to "groceryListBuilder"
   - For inventory questions → Route to "foodInventory"
   - If you can fully answer the query → Return "finish"

2. MAINTAIN CONVERSATION CONTEXT AT ALL COSTS:
   - If the user is asking about something mentioned earlier (like "tell me about that diet" or "can you explain more about X"), continue that same topic
   - Pay special attention to references like "it", "that recipe", "the diet you mentioned", etc.

3. When a user follows up about a topic started by another agent:
   - If it's now in your expertise area, answer it
   - If not, route to the appropriate agent and explain why in your response

YOUR PRIMARY GOAL: Ensure contextual continuity by routing to the right agent or providing responses that directly address the user's actual query.`;

  // Add enhanced prompt as a system message at the beginning
  const augmentedMessages = [
    { role: "system", content: enhancedSystemPrompt },
    ...messages,
  ] as BaseMessage[];

  return model
    .withStructuredOutput(outputSchema, { name: "Response" })
    .invoke(augmentedMessages);
}

/**
 * Recipe Suggester Agent
 * Recommends meals based on preferences and constraints
 */
export async function recipeSuggester(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  const systemPrompt =
    "You are a recipe expert named 'Recipe Suggester' that can recommend meals based on user preferences, dietary needs, and available ingredients. " +
    "IMPORTANT: Always identify yourself as 'Recipe Suggester' at the beginning of your response. " +
    "ROUTING INSTRUCTIONS: " +
    "- If the user asks about diet plans, weight loss strategies, or nutrition advice, say 'Let me connect you with our dietary advisor who specializes in this' and route to 'dietaryAdvisor'. " +
    "- If the user asks about creating grocery lists, say 'Let me connect you with our grocery expert' and route to 'groceryListBuilder'. " +
    "- If the user asks about checking ingredients they have, route to 'foodInventory'. " +
    "- If you can fully answer the question about recipes or meal suggestions, return 'finish'. " +
    "MAINTAIN CONTEXT: " +
    "- If the user refers to something previously mentioned (like 'that recipe' or 'it'), make sure to reference the specific item from earlier in the conversation. " +
    "- Never start over with generic responses if the conversation has a clear context. " +
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
  const response = await callLlm(messages, targetAgentNodes, "recipe expert");
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "recipeSuggester",
    topic: response.topic || "recipe suggestions",
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
    "You are a nutrition expert named 'Dietary Advisor' that can provide dietary advice based on health goals and restrictions. " +
    "IMPORTANT: Always identify yourself as 'Dietary Advisor' at the beginning of your response. " +
    "ROUTING INSTRUCTIONS: " +
    "- If the user asks about specific recipes or meal ideas, say 'Let me connect you with our recipe expert who can help with that' and route to 'recipeSuggester'. " +
    "- If the user asks about creating grocery lists, say 'Let me connect you with our grocery expert' and route to 'groceryListBuilder'. " +
    "- If the user asks about checking ingredients they have, route to 'foodInventory'. " +
    "- If you can fully answer the question about nutrition, diets, or dietary restrictions, return 'finish'. " +
    "MAINTAIN CONTEXT: " +
    "- If the user refers to a diet plan or nutrition advice mentioned earlier, continue that same topic. " +
    "- Pay special attention to context like 'that diet' or 'the nutrition plan you mentioned'. " +
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
  const response = await callLlm(
    messages,
    targetAgentNodes,
    "nutrition expert"
  );
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "dietaryAdvisor",
    topic: response.topic || "dietary advice",
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
    "You are a grocery expert named 'Grocery List Builder' that can create shopping lists based on recipes and meal plans. " +
    "IMPORTANT: Always identify yourself as 'Grocery List Builder' at the beginning of your response. " +
    "ROUTING INSTRUCTIONS: " +
    "- If the user asks about specific recipes or meal ideas, say 'Let me connect you with our recipe expert' and route to 'recipeSuggester'. " +
    "- If the user asks about nutrition advice or dietary restrictions, say 'Let me connect you with our dietary expert' and route to 'dietaryAdvisor'. " +
    "- If the user asks about checking ingredients they have, route to 'foodInventory'. " +
    "- If you can fully answer the question about grocery lists or shopping, return 'finish'. " +
    "MAINTAIN CONTEXT: " +
    "- Base your grocery lists on recipes or meal plans specifically mentioned in the conversation. " +
    "- If the user asks about 'ingredients for that recipe', reference the specific recipe discussed. " +
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
  const response = await callLlm(messages, targetAgentNodes, "grocery expert");
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "groceryListBuilder",
    topic: response.topic || "grocery list",
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
    "You are an inventory expert named 'Food Inventory' that can help track ingredients and suggest meals based on what users already have. " +
    "IMPORTANT: Always identify yourself as 'Food Inventory' at the beginning of your response. " +
    "ROUTING INSTRUCTIONS: " +
    "- If the user asks about specific recipes or meal ideas, say 'Let me connect you with our recipe expert' and route to 'recipeSuggester'. " +
    "- If the user asks about nutrition advice or dietary restrictions, say 'Let me connect you with our dietary expert' and route to 'dietaryAdvisor'. " +
    "- If the user asks about creating grocery lists, say 'Let me connect you with our grocery expert' and route to 'groceryListBuilder'. " +
    "- If you can fully answer the question about available ingredients or pantry management, return 'finish'. " +
    "MAINTAIN CONTEXT: " +
    "- If the user refers to ingredients mentioned earlier, reference those specific items. " +
    "- Keep track of ingredients the user has mentioned having throughout the conversation. " +
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
  const response = await callLlm(
    messages,
    targetAgentNodes,
    "inventory expert"
  );
  const aiMsg = {
    role: "ai",
    content: response.response,
    name: "foodInventory",
    topic: response.topic || "food inventory",
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
  // Check if we're resuming with a message already passed in
  const lastMessage = state.messages[state.messages.length - 1];

  // If the last message already comes from a user, we can use that and don't need to interrupt
  if (lastMessage && lastMessage.constructor.name === "HumanMessage") {
    let activeAgent: string | undefined = undefined;

    // Find the active agent from previous messages
    for (let i = state.messages.length - 2; i >= 0; i--) {
      if (state.messages[i].name) {
        activeAgent = state.messages[i].name;
        break;
      }
    }

    // If no active agent was found, default to recipe suggester
    if (!activeAgent) {
      activeAgent = "recipeSuggester";
    }

    // Always route to the last active agent to maintain conversation flow
    return new Command({
      goto: activeAgent,
    });
  }

  // Only interrupt if we need user input (this should never be reached in an API context)
  const userInput: string = interrupt("Ready for user input.");

  let activeAgent: string | undefined = undefined;

  // Look up the active agent
  for (let i = state.messages.length - 1; i >= 0; i--) {
    if (state.messages[i].name) {
      activeAgent = state.messages[i].name;
      break;
    }
  }

  // If no active agent was found, default to recipe suggester
  if (!activeAgent) {
    activeAgent = "recipeSuggester";
  }

  const message = {
    role: "user",
    content: userInput,
  };

  // Always route to the last active agent to maintain conversation continuity
  return new Command({
    goto: activeAgent,
    update: { messages: [message] },
  });
}
