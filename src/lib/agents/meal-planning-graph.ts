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
    // We'll always start with the recipe suggester as the entry point
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
  threadConfig: ReturnType<typeof createThreadConfig>
) {
  const input =
    typeof userInput === "string"
      ? { messages: [{ role: "user", content: userInput }] }
      : userInput;

  const updates = [];

  // Stream updates from the graph
  for await (const update of await graph.stream(input, threadConfig)) {
    const lastMessage = update.messages
      ? update.messages[update.messages.length - 1]
      : undefined;

    if (lastMessage && lastMessage._getType() === "ai") {
      updates.push({
        agent: lastMessage.name,
        content: lastMessage.content,
      });
    }
  }

  return updates;
}
