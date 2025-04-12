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
    });

  // Define routing function for entry point
  const routeInitialNode = (state: typeof MessagesAnnotation.State) => {
    if (state.messages && state.messages.length > 0) {
      // Check if this is a resumption of conversation with existing messages
      if (state.messages.length > 1) {
        // Try to route to the last active agent to maintain continuity
        for (let i = state.messages.length - 1; i >= 0; i--) {
          const msg = state.messages[i];
          if (msg.name && typeof msg.name === "string") {
            // Check if the name matches one of our agent nodes
            const agentName = msg.name;
            if (
              [
                "recipeSuggester",
                "dietaryAdvisor",
                "groceryListBuilder",
                "foodInventory",
              ].includes(agentName)
            ) {
              return agentName;
            }
          }
        }
      }

      // If no previous agent found or this is a new conversation, check first message for intent
      const firstMessage = state.messages[0];

      // Check if the first message contains keywords related to dietary advice
      if (firstMessage.content && typeof firstMessage.content === "string") {
        const content = firstMessage.content.toLowerCase();

        if (
          content.includes("dietary") ||
          content.includes("diet") ||
          content.includes("nutrition") ||
          content.includes("nutritional") ||
          content.includes("dietary advisor") ||
          content.includes("weight loss") ||
          content.includes("calories") ||
          content.includes("healthy eating")
        ) {
          return "dietaryAdvisor";
        }
      }
    }

    // Default to recipe suggester for other queries
    return "recipeSuggester";
  };

  // Add conditional edge from START to either recipeSuggester or dietaryAdvisor
  builder.addConditionalEdges(START, routeInitialNode, [
    "recipeSuggester",
    "dietaryAdvisor",
  ]);

  // Create memory saver for persistence
  const checkpointer = new MemorySaver();

  // Compile the graph with checkpointer
  const graph = builder.compile({
    checkpointer,
    // The name helps with debugging
    name: "MealPlannerGraph",
  });

  return graph;
}

/**
 * Creates a new conversation thread config
 */
export function createThreadConfig() {
  return {
    configurable: { thread_id: uuidv4() },
    streamMode: "values" as const,
    // Enable checkpoint saving and loading
    runnable: {
      // Always reset with user input
      reset: false,
      // Always attempt to load from checkpoint
      load: true,
      // Always save state to checkpoint
      save: true,
    },
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

  try {
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
  } catch (error) {
    console.error("Error processing input:", error);
    updates.push({
      agent: "System",
      content:
        "Sorry, there was an error processing your request. Please try again.",
      topic: currentTopic,
    });
  }

  return updates;
}
