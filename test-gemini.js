// Test file to verify Gemini AI connection
import { createChatSession } from '../lib/gemini-ai.js';

async function testGeminiConnection() {
  try {
    console.log('Testing Gemini AI connection...');
    const chatSession = createChatSession();
    const result = await chatSession.sendMessage('Hello, can you respond with "Connection successful"?');
    const response = await result.response;
    const text = response.text();
    console.log('Gemini AI Response:', text);
  } catch (error) {
    console.error('Gemini AI Error:', error);
  }
}

testGeminiConnection();
