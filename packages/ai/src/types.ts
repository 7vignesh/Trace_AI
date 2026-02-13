export interface FlowExplanation {
  line: number;
  type: string;
  explanation: string;
  variables?: { name: string; value: string; action: "created" | "updated" | "read" }[];
  complexity?: string; // Big-O if applicable
}

export type ExplanationDepth = "beginner" | "intermediate" | "senior";
