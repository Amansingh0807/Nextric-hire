import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const testChat = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("Test chat function called with message:", args.message);
    return { success: true, message: "Test response: " + args.message };
  },
});
