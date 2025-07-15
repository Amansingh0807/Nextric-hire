import { ConvexError, v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { CREDIT_COST } from "@/lib/api-limits";
import { Id } from "./_generated/dataModel";
import { JobInsightStatus, Role } from "@/lib/constants";
import { api, internal } from "./_generated/api";
import { chatSession } from "@/lib/gemini-ai";
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
    const apiLimits = await ctx.db
      .query("apiLimits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();

    if (!apiLimits || apiLimits.credits < CREDIT_COST.JOB_CHAT_MESSAGE) {
      throw new ConvexError({
        type: "INSUFFICIENT_CREDITS",
        message: "You have run out of credits",
        required: CREDIT_COST.JOB_CHAT_MESSAGE,
        available: apiLimits?.credits ?? 0,
      });
    }

    const job = await ctx.db.get(args.jobId as Id<"jobs">);
    if (!job) throw new ConvexError("Job nod found");

    const conversationId = await ctx.db.insert("jobInsightConversations", {
      userId: args.userId,
      jobId: args.jobId as Id<"jobs">,
      text: args.message,
      role: Role.USER,
      status: JobInsightStatus.COMPLETED,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule AI response
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
      const stream = await chatSession.sendMessageStream(prompt);
      let fullResponse = "";
      let lastUpdateTime = Date.now();

      // Handle the stream properly - use the stream's async iterator
      const reader = stream.stream;
      
      // Alternative approach 1: If stream has a proper async iterator
      if (reader && typeof reader[Symbol.asyncIterator] === 'function') {
        for await (const chunk of reader) {
          // FIX APPLIED HERE: Call text() to get the string
          const textContent = chunk.text();
          if (textContent) {
            fullResponse += textContent;
            
            const currentTime = Date.now();
            // FIX APPLIED HERE: Use textContent instead of chunk.text
            if (currentTime - lastUpdateTime > 100 || textContent.includes(".")) {
              await ctx.runMutation(api.jobInsightConversation.update, {
                id: responseId,
                text: fullResponse + " ...",
              });
              lastUpdateTime = currentTime;
            }
          }
        }
      } else {
        // Alternative approach 2: Use the response method
        const response = await stream.response;
        fullResponse = response.text();
        
        await ctx.runMutation(api.jobInsightConversation.update, {
          id: responseId,
          text: fullResponse + " ...",
        });
      }

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
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Update the conversation with error status
      await ctx.runMutation(api.jobInsightConversation.update, {
        id: responseId,
        text: "Sorry, I encountered an error while generating the response. Please try again.",
        status: JobInsightStatus.FAILED,
      });
      
      throw error;
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