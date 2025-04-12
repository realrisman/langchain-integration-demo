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
        "The next agent to call, or 'finish' if the user's query has been resolved. Avoid unnecessary handoffs between agents - only route to another agent if absolutely necessary."
      ),
    topic: z
      .string()
      .optional()
      .describe(
        "The main topic being discussed (e.g., 'salmon recipe', 'vegetarian diet', 'weekly meal plan')"
      ),
  });

  // Check if we have messages with enough conversational context
  const isFollowupQuery = messages.length > 2;

  // Extract conversation history to analyze prior context
  let conversationHistory = "";
  let lastAgentResponse = "";
  const previousTopics = new Set<string>();
  let primaryTopic = "";

  if (isFollowupQuery) {
    // Get messages from the conversation to analyze context and flow
    const historyMessages = messages.slice(1); // Skip system message

    // Build a summary of the conversation history
    for (let i = 0; i < historyMessages.length; i++) {
      const msg = historyMessages[i];

      if (msg.constructor.name === "AIMessage") {
        conversationHistory += `AI (${msg.name || "assistant"}): ${truncateText(msg.content as string, 150)}\n`;

        // Store last AI message for reference
        if (i === historyMessages.length - 2) {
          lastAgentResponse = msg.content as string;
        }

        // Extract topics
        if (msg.additional_kwargs?.topic) {
          previousTopics.add(msg.additional_kwargs.topic as string);
          // Last encountered topic becomes primary
          primaryTopic = msg.additional_kwargs.topic as string;
        }
      } else {
        conversationHistory += `User: ${truncateText(msg.content as string, 150)}\n`;
      }
    }
  }

  // Create enhanced system prompt with context awareness
  let contextualPrompt = `You are a ${agentName} responding to users in a meal planning system.
  
CRITICAL CONTEXT INSTRUCTIONS:
1. MAINTAIN PERFECT CONVERSATION CONTINUITY:
   - Your response MUST directly connect to the previous message history below.
   - Respond as if you're in an ongoing conversation, not starting a new one.
   - If the user is asking about something previously mentioned, reference it explicitly.
   - The user's input is a direct continuation of the previous conversation.
   - AVOID INTRODUCTIONS OR GENERIC GREETINGS - users expect you to remember details from earlier.
   
2. AVOID UNNECESSARY ROUTING:
   - Only route to another agent if the user clearly needs specialized expertise.
   - If you can answer the follow-up question yourself, do so directly.
   
3. PREVENT INCORRECT HISTORY REFERENCES:
   - Never invent conversations that haven't happened.
   - Don't mention topics that weren't previously discussed.
   - Only reference facts, preferences, or dietary needs the user has actually shared.
`;

  // Add context information if this is a follow-up
  if (isFollowupQuery) {
    contextualPrompt += `\nCONVERSATION HISTORY (read carefully):
${conversationHistory}

IMPORTANT CONTINUITY NOTES:
- Primary conversation topic: ${primaryTopic || "meal planning"}
${previousTopics.size > 0 ? `- Topics discussed so far: ${Array.from(previousTopics).join(", ")}` : ""}
- The user's current message is a DIRECT FOLLOW-UP to this conversation.
- You must maintain context with your previous responses.
${lastAgentResponse ? `- Your last response was about: "${truncateText(lastAgentResponse, 100)}"` : ""}
`;
  }

  // Add enhanced prompt as a system message at the beginning
  const augmentedMessages = [
    { role: "system", content: contextualPrompt },
    ...messages,
  ] as BaseMessage[];

  return model
    .withStructuredOutput(outputSchema, { name: "Response" })
    .invoke(augmentedMessages);
}

/**
 * Helper function to truncate text to specified length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Recipe Suggester Agent
 * Recommends meals based on preferences and constraints
 */
export async function recipeSuggester(
  state: typeof MessagesAnnotation.State
): Promise<Command> {
  // Debug the incoming state
  console.log(
    "recipeSuggester received state with",
    state.messages?.length || 0,
    "messages"
  );

  // If we have no messages, this indicates an issue with state preservation
  if (!state.messages || state.messages.length === 0) {
    console.error("RecipeSuggester received empty message state!");
    return new Command({
      goto: "human",
      update: {
        messages: [
          {
            role: "ai",
            content:
              "I apologize, but I'm having trouble accessing our conversation history. Could you please let me know what kind of meal planning help you're looking for today?",
            name: "recipeSuggester",
            topic: "recipe suggestions",
          },
        ],
      },
    });
  }

  const systemPrompt =
    "You are a recipe expert named 'Recipe Suggester' that can recommend meals based on user preferences, dietary needs, and available ingredients. " +
    "IMPORTANT: Always identify yourself as 'Recipe Suggester' at the beginning of your response. " +
    "CRITICAL CONTEXT INSTRUCTIONS: " +
    "- Respond with full awareness of the conversation history. The user's latest message is a direct follow-up to previous messages. " +
    "- If a conversation about meal planning, diet, or recipes is already in progress, CONTINUE that conversation. " +
    "- NEVER introduce yourself as if starting a new conversation if you've already spoken to the user. " +
    "- NEVER invent or reference previous conversations that didn't happen. " +
    "- ALWAYS check if the user is referencing something from earlier in the conversation (such as 'high protein foods' from a diet discussion). " +
    "ROUTING INSTRUCTIONS: " +
    "- ONLY route to other agents after you've collected sufficient information or if the request is clearly outside your expertise. " +
    "- For meal planning requests, you should handle them yourself FIRST by asking about preferences and suggesting recipes. " +
    "- If the user asks specifically about diet plans, weight loss strategies, or nutrition advice (NOT meal planning), say 'Let me connect you with our dietary advisor who specializes in this' and route to 'dietaryAdvisor'. " +
    "- ONLY route to 'groceryListBuilder' AFTER you have already suggested specific recipes and the user asks for a shopping list. " +
    "- ONLY route to 'foodInventory' if the user explicitly asks to check available ingredients. " +
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
    "CRITICAL CONTEXT INSTRUCTIONS: " +
    "- Respond with full awareness of the conversation history. The user's latest message is a direct follow-up to previous messages. " +
    "- If a conversation about diet plans, nutrition, or health goals is already in progress, CONTINUE that conversation. " +
    "- NEVER introduce yourself as if starting a new conversation if you've already spoken to the user. " +
    "- NEVER invent or reference previous conversations that didn't happen. " +
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
    "- If a user message does NOT contain specific recipes that were already discussed, say 'To create a shopping list, I'll need specific recipe information first' and route to 'recipeSuggester'. " +
    "- If the user explicitly asks about nutrition advice or dietary restrictions, say 'Let me connect you with our dietary expert' and route to 'dietaryAdvisor'. " +
    "- If the user explicitly asks about checking ingredients they have, route to 'foodInventory'. " +
    "- If you already have recipe information and can create a grocery list, handle it yourself and return 'finish'. " +
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
      const msg = state.messages[i];
      // Check for agent name property
      if (msg.name && typeof msg.name === "string") {
        activeAgent = msg.name;
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
    const msg = state.messages[i];
    // Check for agent name property
    if (msg.name && typeof msg.name === "string") {
      activeAgent = msg.name;
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
