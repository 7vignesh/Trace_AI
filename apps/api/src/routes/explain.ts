import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { streamSSE } from "hono/streaming";
import { extractFlow } from "@traceai/parser";
import { buildPrompt, streamExplanation } from "@traceai/ai";
import type { ExplanationDepth } from "@traceai/ai";

const explainRouter = new Hono();

const explainSchema = z.object({
  code: z.string().min(1).max(10000),
  depth: z.enum(["beginner", "intermediate", "senior"]).default("beginner"),
});

// Install the validator middleware: bun add @hono/zod-validator
explainRouter.post("/explain", zValidator("json", explainSchema), async (c) => {
  const { code, depth } = c.req.valid("json");

  // Step 1: Parse the code
  const flowNodes = extractFlow(code);

  // Step 2: Build the AI prompt
  const prompt = buildPrompt(code, flowNodes, depth as ExplanationDepth);

  // Step 3: Stream the response via SSE
  return streamSSE(c, async (stream) => {
    let id = 0;
    for await (const chunk of streamExplanation(prompt)) {
      await stream.writeSSE({
        data: chunk,
        event: "chunk",
        id: String(id++),
      });
    }
    await stream.writeSSE({
      data: "[DONE]",
      event: "done",
      id: String(id),
    });
  });
});

export { explainRouter };
