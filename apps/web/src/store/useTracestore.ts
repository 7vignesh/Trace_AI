import { create } from "zustand";

export interface FlowExplanation {
  line: number;
  type: string;
  explanation: string;
  variables?: { name: string; value: string; action: string }[];
  complexity?: string | null;
}

type Depth = "beginner" | "intermediate" | "senior";

interface TraceState {
  code: string;
  setCode: (code: string) => void;
  depth: Depth;
  setDepth: (d: Depth) => void;
  explanations: FlowExplanation[];
  setExplanations: (e: FlowExplanation[]) => void;
  isLoading: boolean;
  setLoading: (b: boolean) => void;
  hoveredLine: number | null;
  setHoveredLine: (line: number | null) => void;
  error: string | null;
  setError: (e: string | null) => void;
  showInlineComments: boolean;
  toggleInlineComments: () => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  code: `function greet(name) {\n  const message = "Hello, " + name;\n  console.log(message);\n  return message;\n}`,
  setCode: (code) => set({ code }),
  depth: "beginner",
  setDepth: (depth) => set({ depth }),
  explanations: [],
  setExplanations: (explanations) => set({ explanations }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  hoveredLine: null,
  setHoveredLine: (hoveredLine) => set({ hoveredLine }),
  error: null,
  setError: (error) => set({ error }),
  showInlineComments: false,
  toggleInlineComments: () => set((s) => ({ showInlineComments: !s.showInlineComments })),
}));
