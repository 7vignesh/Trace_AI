import { useTraceStore } from "../store/useTracestore";
import { fetchExplanation } from "../services/api";

export function Toolbar() {
    const { code, depth, setDepth, setExplanations, setLoading, setError, isLoading } =
        useTraceStore();

    async function handleExplain() {
        setLoading(true);
        setError(null);
        setExplanations([]);
        let accumulated = "";

        await fetchExplanation(
            code,
            depth,
            (chunk) => {
                accumulated += chunk;
            },
            () => {
                setLoading(false);
                try {
                    // Find the first '[' and the last ']' to extract the JSON array
                    const start = accumulated.indexOf("[");
                    const end = accumulated.lastIndexOf("]");

                    if (start === -1 || end === -1 || start > end) {
                        throw new Error("No JSON array found");
                    }

                    const jsonStr = accumulated.substring(start, end + 1);
                    const parsed = JSON.parse(jsonStr);

                    if (Array.isArray(parsed)) {
                        setExplanations(parsed);
                    }
                } catch (e) {
                    console.error("Full response:", accumulated);
                    setError("Failed to parse AI response");
                }
            },
            (err) => {
                setLoading(false);
                setError(err);
            }
        );
    }

    return (
        <div className="flex items-center gap-4 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TraceAI
            </h1>

            <div className="flex-1" />

            {/* Depth Selector */}
            <div className="flex gap-1 bg-zinc-800 rounded-lg p-1">
                {(["beginner", "intermediate", "senior"] as const).map((d) => (
                    <button
                        key={d}
                        onClick={() => setDepth(d)}
                        className={`px-3 py-1 text-sm rounded-md transition-all ${depth === d
                            ? "bg-blue-600 text-white"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                ))}
            </div>

            {/* Explain Button */}
            <button
                onClick={handleExplain}
                disabled={isLoading}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium
                   hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all shadow-lg shadow-blue-500/20"
            >
                {isLoading ? "Analyzing..." : "⚡ Explain"}
            </button>
        </div>
    );
}
