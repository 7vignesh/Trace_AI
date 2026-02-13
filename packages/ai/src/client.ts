import OpenAI from "openai";
import type { FlowExplanation } from "./types";

// This works with any OpenAI-compatible API (OpenAI, Groq, Ollama, etc.)
const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY || "",
  baseURL: process.env.AI_BASE_URL || "https://api.openai.com/v1",
});

export async function* streamExplanation(
  prompt: string
): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    stream: true,
    temperature: 0.3, // lower = more deterministic
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) yield content;
  }
}

export async function getExplanation(prompt: string): Promise<FlowExplanation[]> {
  const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content || "[]";
  return JSON.parse(text);
}
