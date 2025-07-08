"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;

export const genAI = new GoogleGenerativeAI(apiKey);

export const model = "gemini-2.0-flash";

export const chatSession = genAI.getGenerativeModel({ model: model }).startChat({
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
  },
});
