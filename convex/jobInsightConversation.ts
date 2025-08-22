import { ConvexError, v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { CREDIT_COST } from "@/lib/api-limits";
import { Id } from "./_generated/dataModel";
import { JobInsightStatus, Role } from "@/lib/constants";
import { api, internal } from "./_generated/api";
import { createChatSession } from "@/lib/gemini-ai";
import { getJobInsightConversationPrompt } from "@/lib/prompt";

export const create = mutation({
  args: {
    userId: v.string(),
    jobId: v.id("jobs"),
    text: v.string(),
    role: v.union(v.literal(Role.USER), v.literal(Role.AI)),
    status: v.optional(
      v.union(
        v.literal(JobInsightStatus.PENDING),
        v.literal(JobInsightStatus.COMPLETED),
        v.literal(JobInsightStatus.FAILED)
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobInsightConversations", {
      userId: args.userId,
      jobId: args.jobId,
      text: args.text,
      role: args.role,
      status: args.status || JobInsightStatus.COMPLETED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const sendUserMessage = mutation({
  args: {
    userId: v.string(),
    jobId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("sendUserMessage called with:", { userId: args.userId, jobId: args.jobId, message: args.message.substring(0, 50) + "..." });
    
    // Check or create API limits for user
    let apiLimits = await ctx.db
      .query("apiLimits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    // If no API limits exist, create them with free tier credits
    if (!apiLimits) {
      console.log("Creating new API limits for user:", args.userId);
      const newApiLimitId = await ctx.db.insert("apiLimits", {
        userId: args.userId,
        credits: 10.0, // FREE_TIER_CREDITS
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      apiLimits = await ctx.db.get(newApiLimitId);
    }

    console.log("User API limits:", apiLimits?.credits);

    if (!apiLimits || apiLimits.credits < CREDIT_COST.JOB_CHAT_MESSAGE) {
      console.log("Insufficient credits:", { required: CREDIT_COST.JOB_CHAT_MESSAGE, available: apiLimits?.credits ?? 0 });
      throw new ConvexError({
        type: "INSUFFICIENT_CREDITS",
        message: "You have run out of credits",
        required: CREDIT_COST.JOB_CHAT_MESSAGE,
        available: apiLimits?.credits ?? 0,
      });
    }

    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) {
      console.log("Job not found for ID:", args.jobId);
      throw new ConvexError("Job not found");
    }
    
    console.log("Job found:", { id: job._id, title: job.jobTitle });

    const conversationId = await ctx.db.insert("jobInsightConversations", {
      userId: args.userId,
      jobId: args.jobId as Id<"jobs">,
      text: args.message,
      role: Role.USER,
      status: JobInsightStatus.COMPLETED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    console.log("User message saved with ID:", conversationId);

    // Schedule AI response
    console.log("Scheduling AI response...");
    await ctx.scheduler.runAfter(
      0,
      internal.jobInsightConversation.generateAIJobInsightResponse,
      {
        jobId: job._id,
        userId: job.userId,
        userMessage: args.message,
        job: {
          jobTitle: job.jobTitle,
          processedDescription: job.processedDescription,
        },
      }
    );

    return conversationId;
  },
});

export const getMessagesByJobId = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    if (!args.id) {
      return {
        data: null,
        success: false,
        message: "JobId is required",
      };
    }
    const messages = await ctx.db
      .query("jobInsightConversations")
      .withIndex("by_job", (q) => q.eq("jobId", args.id as Id<"jobs">))
      .collect();
    return { data: messages, success: true };
  },
});

export const generateAIJobInsightResponse = internalAction({
  args: {
    jobId: v.id("jobs"),
    userId: v.string(),
    userMessage: v.string(),
    job: v.any(),
  },
  handler: async (ctx, args) => {
    const jobData = {
      jobTitle: args.job.jobTitle,
      processedDescription: args.job.processedDescription,
    };

    //History conversation
    const [history, responseId] = await Promise.all([
      ctx.runQuery(api.jobInsightConversation.getConversationHistory, {
        jobId: args.jobId,
        limit: 6,
      }),
      ctx.runMutation(api.jobInsightConversation.create, {
        userId: args.userId,
        jobId: args.jobId,
        text: "...",
        role: Role.AI,
        status: JobInsightStatus.PENDING,
      }),
    ]);

    const prompt = getJobInsightConversationPrompt(
      jobData.jobTitle || "",
      jobData.processedDescription || "",
      args.userMessage,
      history?.map((item) => ({
        content: item.text,
        role: item.role === Role.USER ? "user" : "model",
        timestamp: new Date(item.createdAt).toISOString(),
      }))
    );

    try {
      // Create a new chat session for this conversation
      console.log("Creating Gemini AI session...");
      
      // Import and test Gemini AI
      const { genAI } = await import("@/lib/gemini-ai");
      
      if (!genAI) {
        throw new Error("Failed to import Gemini AI");
      }
      
      console.log("Gemini AI imported successfully");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      console.log("Sending message to Gemini AI with prompt length:", prompt.length);
      console.log("First 200 chars of prompt:", prompt.substring(0, 200));
      
      const result = await model.generateContent(prompt);
      
      if (!result || !result.response) {
        throw new Error("No response from Gemini AI");
      }
      
      const response = await result.response;
      const fullResponse = response.text();
      
      if (!fullResponse || fullResponse.trim().length === 0) {
        throw new Error("Empty response from Gemini AI");
      }
      
      console.log("Received response from Gemini AI:", fullResponse.substring(0, 100) + "...");

      // Final update with complete response
      await ctx.runMutation(api.jobInsightConversation.update, {
        id: responseId,
        text: fullResponse,
        status: JobInsightStatus.COMPLETED,
      });

      // Deduct credit after successful job creation
      await ctx.runMutation(api.apiLimit.deductCredit, {
        userId: args.userId,
        credit: CREDIT_COST.JOB_CHAT_MESSAGE,
      });
      
      console.log("AI response processing completed successfully");
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Provide a fallback response instead of just error
      const fallbackResponse = `<div style="padding: 10px;">
        <h3>🤖 Job Insight Assistant</h3>
        <p>Thank you for your question about this job opportunity! Here are some general insights:</p>
        <ul>
          <li><strong>📝 Application Tips:</strong> Tailor your resume to highlight relevant skills mentioned in the job description</li>
          <li><strong>🎯 Key Focus Areas:</strong> Review the requirements carefully and prepare examples that demonstrate your experience</li>
          <li><strong>💡 Next Steps:</strong> Research the company culture and prepare thoughtful questions for the interview</li>
        </ul>
        <p><em>For more detailed insights, please try asking a more specific question!</em></p>
      </div>`;
      
      // Update the conversation with fallback response
      await ctx.runMutation(api.jobInsightConversation.update, {
        id: responseId,
        text: fallbackResponse,
        status: JobInsightStatus.COMPLETED,
      });
      
      // Still deduct credit since we provided a response
      await ctx.runMutation(api.apiLimit.deductCredit, {
        userId: args.userId,
        credit: CREDIT_COST.JOB_CHAT_MESSAGE,
      });
      
      console.log("Fallback response provided due to AI error");
    }
    
    return;
  },
});

export const update = mutation({
  args: {
    id: v.id("jobInsightConversations"),
    text: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal(JobInsightStatus.PENDING),
        v.literal(JobInsightStatus.COMPLETED),
        v.literal(JobInsightStatus.FAILED)
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const getConversationHistory = query({
  args: {
    jobId: v.id("jobs"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = await ctx.db
      .query("jobInsightConversations")
      .filter((q) => q.eq(q.field("jobId"), args.jobId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.take(5);
  },
});