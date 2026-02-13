import type { FlowNode } from "@traceai/parser";
import type { ExplanationDepth } from "./types";

export function buildPrompt(
  code: string,
  flowNodes: FlowNode[],
  depth: ExplanationDepth = "beginner"
): string {
  const depthInstructions = {
    beginner:
      "Explain as if the reader has never programmed before. Use analogies and simple language.",
    intermediate:
      "Explain for someone who knows basics but needs help with logic flow and patterns.",
    senior:
      "Explain concisely with technical precision. Mention edge cases and performance implications.",
  };

  return `You are TraceAI, an expert code explanation engine.

TASK: Analyze the following code and explain its execution flow LINE BY LINE.

CODE:
\`\`\`
${code}
\`\`\`

AST METADATA (use this to understand structure):
${JSON.stringify(flowNodes, null, 2)}

DEPTH LEVEL: ${depth}
${depthInstructions[depth]}

RULES:
1. Explain execution flow SEQUENTIALLY — follow the order the code runs.
2. Reference EXACT line numbers.
3. Do NOT give vague summaries. Be specific about what each line does.
4. Track variables: note when they are created, updated, or read.
5. For loops, explain iteration behavior.
6. For conditions, explain both branches.
7. For async/await, explain the asynchronous behavior.

OUTPUT FORMAT: Return ONLY a valid JSON array, no markdown, no explanation outside JSON:
[
  {
    "line": 1,
    "type": "variable_init",
    "explanation": "...",
    "variables": [{ "name": "x", "value": "5", "action": "created" }],
    "complexity": null
  }
]

Valid types: variable_init, variable_update, function_declaration, function_call,
loop_start, loop_iteration, loop_end, conditional_check, conditional_branch,
return_statement, await_expression, import_statement, export_statement, expression

Respond with ONLY the JSON array.`;
}
