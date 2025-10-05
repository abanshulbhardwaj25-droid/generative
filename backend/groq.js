// groqChat.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "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",
});

// Simple in-memory conversation history
const memory = []; // { role: "user"|"assistant", content: string }
const BOT_NAME = "GrokBot";
const systemMessage = {
  role: "system",
  content: `You are ${BOT_NAME}, a friendly AI assistant that explains things clearly and concisely.`
};


export async function getGroqReply(message) {
  if (!message || typeof message !== "string") {
    throw new Error("Invalid message");
  }

  // Add user message to memory
  memory.push({ role: "user", content: message });

  // Keep only last 10 messages to avoid long prompt
  const recentMemory = memory.slice(-10);
  const messagesToSend = [systemMessage, ...recentMemory];

  try {
    const response = await groq.chat.completions.create({
      messages: messagesToSend.map(m => ({
    role: m.role,
    content: m.content
  })),
      model: "openai/gpt-oss-20b",
    });

    const botReply = response.choices[0].message.content;

    // Add bot reply to memory
    memory.push({ role: "assistant", content: botReply });
   return { reply: `${BOT_NAME}: ${botReply}`, error: false };

    return botReply;
  } catch (err) {
    console.error("Groq API Error:", err);
    throw new Error("Failed to get reply from Groq");
  }
}
