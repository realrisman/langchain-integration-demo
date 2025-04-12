import { create } from "zustand";
import { ChatMessage } from "@/types/chat";
import { ChatService } from "@/lib/services/chat-service";

interface ChatState {
  // State
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setInput: (input: string) => void;
  addMessage: (message: Omit<ChatMessage, "timestamp">) => ChatMessage;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  messages: [],
  input: "",
  isLoading: false,
  error: null,

  // Actions
  setInput: (input) => set({ input }),

  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    return newMessage;
  },

  sendMessage: async (content) => {
    if (!content.trim()) return;

    set({ error: null });

    const { addMessage } = get();
    addMessage({
      role: "user",
      content: content.trim(),
    });

    set({ input: "", isLoading: true });

    try {
      // Send to API via service
      const messages = [...get().messages];
      const response = await ChatService.sendMessage(messages);

      // Add assistant's response
      addMessage({
        role: "assistant",
        content: response,
      });
    } catch (err) {
      console.error("Error sending message:", err);
      set({
        error: err instanceof Error ? err.message : "Failed to send message",
      });

      // Add error message
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetChat: () =>
    set({
      messages: [],
      input: "",
      error: null,
    }),
}));
