import { useTraceStore } from "../store/useTracestore";

const typeIcons: Record<string, string> = {
    variable_init: "📦",
    variable_update: "✏️",
    function_declaration: "🔧",
    function_call: "📞",
    loop_start: "🔁",
    loop_iteration: "🔄",
    conditional_check: "❓",
    conditional_branch: "🔀",
    return_statement: "↩️",
    await_expression: "⏳",
    import_statement: "📥",
    expression: "⚡",
};

export function ExplanationPanel() {
    const { explanations, isLoading, hoveredLine, setHoveredLine, error } = useTraceStore();

    if (error) {
        return (
            <div className="p-4 text-red-400 bg-red-950/30 rounded-lg m-4">
                ⚠️ {error}
            </div>
        );
    }

    if (isLoading && explanations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-zinc-400 text-lg">
                    ⏳ Analyzing execution flow...
                </div>
            </div>
        );
    }

    if (explanations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500">
                Click "Explain" to analyze your code
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full p-4 space-y-2">
            {explanations.map((item, i) => (
                <div
                    key={i}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${hoveredLine === item.line
                            ? "border-blue-500 bg-blue-950/40"
                            : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-600"
                        }`}
                    onMouseEnter={() => setHoveredLine(item.line)}
                    onMouseLeave={() => setHoveredLine(null)}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-zinc-800 px-2 py-0.5 rounded text-blue-400">
                            L{item.line}
                        </span>
                        <span className="text-sm">
                            {typeIcons[item.type] || "▸"} {item.type.replace(/_/g, " ")}
                        </span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                        {item.explanation}
                    </p>
                    {/* Variable tracking */}
                    {item.variables && item.variables.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {item.variables.map((v, vi) => (
                                <span
                                    key={vi}
                                    className={`text-xs px-2 py-0.5 rounded font-mono ${v.action === "created"
                                            ? "bg-green-900/50 text-green-400"
                                            : v.action === "updated"
                                                ? "bg-yellow-900/50 text-yellow-400"
                                                : "bg-zinc-800 text-zinc-400"
                                        }`}
                                >
                                    {v.name} = {v.value}
                                </span>
                            ))}
                        </div>
                    )}
                    {/* Complexity */}
                    {item.complexity && (
                        <div className="mt-2 text-xs text-purple-400">
                            ⏱ Complexity: {item.complexity}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
