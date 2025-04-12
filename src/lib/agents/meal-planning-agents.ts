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
        "The next agent to call, or 'finish' if the user's query has been resolved."
      ),
    topic: z
      .string()
      .optional()
      .describe(
        "The main topic being discussed (e.g., 'salmon recipe', 'vegetarian diet', 'weekly meal plan')"
      ),
  });

  // Check if we're in a potential loop by examining recent AI messages
  const aiMessages = messages.filter(
    (msg) => msg.constructor.name === "AIMessage"
  );
  const recentAiMessages = aiMessages.slice(-6);

  // More sophisticated loop detection
  let askingForPreferences = 0;
  for (const msg of recentAiMessages) {
    const content = msg.content.toString().toLowerCase();
    if (
      (content.includes("dietary") && content.includes("preference")) ||
      (content.includes("specify") && content.includes("diet")) ||
      (content.includes("let me know") && content.includes("preferences"))
    ) {
      askingForPreferences++;
    }
  }

  // Detect if we're in a loop asking for dietary preferences (at least 3 similar questions)
  const isInPreferenceLoop = askingForPreferences >= 3;

  // Extract the latest user message
  const latestUserMessage = messages
    .slice()
    .reverse()
    .find((msg) => msg.constructor.name === "HumanMessage");

  // If in a loop and asking simple recipe query, force providing generic healthy recipes
  if (
    isInPreferenceLoop &&
    latestUserMessage &&
    (latestUserMessage.content.toString().toLowerCase().includes("healthy") ||
      latestUserMessage.content.toString().toLowerCase().includes("recipe"))
  ) {
    return {
      response:
        "Based on your interest in healthy recipes, here are some general healthy dinner options that most people enjoy:\n\n" +
        "1. Mediterranean Baked Salmon with roasted vegetables and quinoa\n" +
        "2. Grilled Chicken with steamed broccoli and sweet potatoes\n" +
        "3. Vegetable Stir-Fry with tofu and brown rice\n" +
        "4. Turkey and Vegetable Chili\n" +
        "5. Zucchini Noodles with lean protein and tomato sauce\n\n" +
        "These meals are balanced, nutrient-dense, and suitable for most dietary preferences. Would you like more specific details about any of these recipes?",
      goto: "finish",
      topic: "healthy recipes",
    };
  }

  // Create enhanced system prompt with context awareness
  const enhancedSystemPrompt = `You are a ${agentName} responding to users in a meal planning system.
  
IMPORTANT: Carefully review the full conversation history before responding to maintain context and provide coherent responses.

1. If the user is asking a follow-up question about a recipe, meal, or topic mentioned earlier:
   - Provide detailed information that builds on what was previously discussed
   - Don't start over with new recommendations unless explicitly requested
   - Reference specific items from previous messages

2. If the user expresses interest in a specific recipe mentioned earlier:
   - Provide detailed ingredients, cooking instructions, and nutritional information
   - Don't change the subject to suggesting new recipes
   
3. Remember user preferences mentioned earlier in the conversation (e.g., likes fish, vegetarian, gluten-free)

4. Be consistent with your previous responses. Don't recommend a completely different set of recipes if the user is asking for details about one you already mentioned.`;

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
    "You are a recipe expert that can recommend meals based on user preferences, dietary needs, and available ingredients. " +
    "When a user asks for more details about a specific recipe you previously mentioned, provide them with detailed instructions, ingredients, and cooking tips for that recipe. " +
    "If the user asks for 'healthy recipes' without specifying preferences, provide general healthy recipe options rather than asking for more details. " +
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
    "You are a nutrition expert that can provide dietary advice based on health goals and restrictions. " +
    "Pay attention to the conversation history to provide consistent advice that builds on previous exchanges. " +
    "If the user asks for 'healthy recipes' without specifying preferences, provide general nutritional advice rather than repeatedly asking for more details. " +
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
    "You are a grocery expert that can create shopping lists based on recipes and meal plans. " +
    "Pay close attention to recipes and ingredients mentioned earlier in the conversation to create comprehensive lists. " +
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
    "You are an inventory manager that tracks available ingredients and suggests using existing items. " +
    "Reference the conversation history to understand what recipes and ingredients have been discussed. " +
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
  const response = await callLlm(
    messages,
    targetAgentNodes,
    "inventory manager"
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

    // Default to recipe suggester if no active agent is found
    return new Command({
      goto: activeAgent || "recipeSuggester",
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

  const message = {
    role: "user",
    content: userInput,
  };

  // Default to recipe suggester if no active agent is found
  return new Command({
    goto: activeAgent || "recipeSuggester",
    update: { messages: [message] },
  });
}
