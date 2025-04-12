import { v4 as uuidv4 } from "uuid";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  MemorySaver,
  Command,
} from "@langchain/langgraph";
import {
  recipeSuggester,
  dietaryAdvisor,
  groceryListBuilder,
  foodInventory,
  humanNode,
} from "./meal-planning-agents";

/**
 * Creates and configures the meal planning multi-agent system
 */
export function createMealPlanningGraph() {
  // Create the graph builder with messages as the state
  const builder = new StateGraph(MessagesAnnotation)
    // Add all specialized agents
    .addNode("recipeSuggester", recipeSuggester, {
      ends: ["dietaryAdvisor", "groceryListBuilder", "foodInventory", "human"],
    })
    .addNode("dietaryAdvisor", dietaryAdvisor, {
      ends: ["recipeSuggester", "groceryListBuilder", "foodInventory", "human"],
    })
    .addNode("groceryListBuilder", groceryListBuilder, {
      ends: ["recipeSuggester", "dietaryAdvisor", "foodInventory", "human"],
    })
    .addNode("foodInventory", foodInventory, {
      ends: [
        "recipeSuggester",
        "dietaryAdvisor",
        "groceryListBuilder",
        "human",
      ],
    })
    // Add human node to collect user input which routes back to the active agent
    .addNode("human", humanNode, {
      ends: [
        "recipeSuggester",
        "dietaryAdvisor",
        "groceryListBuilder",
        "foodInventory",
      ],
    })
    // We'll default to starting with the recipe suggester
    .addEdge(START, "recipeSuggester");

  // Create memory saver for persistence
  const checkpointer = new MemorySaver();

  // Compile the graph
  const graph = builder.compile({ checkpointer });

  return graph;
}

/**
 * Creates a new conversation thread config
 */
export function createThreadConfig() {
  return {
    configurable: { thread_id: uuidv4() },
    streamMode: "values" as const,
  };
}

/**
 * Processes user input through the multi-agent system
 */
export async function processMealPlannerInput(
  graph: ReturnType<typeof createMealPlanningGraph>,
  userInput: string | Command,
  threadConfig: ReturnType<typeof createThreadConfig>,
  signal?: AbortSignal
) {
  // Format the input appropriately
  let input;

  if (typeof userInput === "string") {
    // For new conversations, format a new user message
    input = { messages: [{ role: "user", content: userInput }] };
  } else {
    // For existing conversations, pass the Command object directly
    input = userInput;
  }

  const updates = [];
  let interactionCounter = 0;
  const MAX_INTERACTIONS = 10; // Maximum number of agent interactions before forcing termination

  // Track the current conversation topic
  let currentTopic = "meal planning";

  // Add the signal to the config if provided
  const config = signal ? { ...threadConfig, signal } : threadConfig;

  // Stream updates from the graph
  for await (const update of await graph.stream(input, config)) {
    // Check if we've been aborted
    if (signal?.aborted) {
      break;
    }

    // Increment interaction counter and check if we've exceeded the maximum
    interactionCounter++;
    if (interactionCounter > MAX_INTERACTIONS) {
      // Add a fallback response for infinite loops
      updates.push({
        agent: "System",
        content:
          "I'll provide some general healthy dinner recipes:\n\n" +
          "1. Mediterranean Baked Salmon with roasted vegetables and quinoa\n" +
          "2. Grilled Chicken with steamed broccoli and sweet potatoes\n" +
          "3. Vegetable Stir-Fry with tofu and brown rice\n" +
          "4. Turkey and Vegetable Chili\n" +
          "5. Zucchini Noodles with lean protein and tomato sauce\n\n" +
          "Would you like more specific details about any of these recipes?",
      });
      break;
    }

    const lastMessage = update.messages
      ? update.messages[update.messages.length - 1]
      : undefined;

    if (lastMessage && lastMessage.constructor.name === "AIMessage") {
      // Update the conversation topic if available
      if (lastMessage.topic) {
        currentTopic = lastMessage.topic;
      }

      updates.push({
        agent: lastMessage.name,
        content: lastMessage.content,
        topic: lastMessage.topic || currentTopic,
      });
    }
  }

  return updates;
}
