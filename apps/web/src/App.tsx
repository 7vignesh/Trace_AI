import { CodeEditor } from "./components/CodeEditor";
import { ExplanationPanel } from "./components/ExplanationPanel";
import { Toolbar } from "./components/Toolbar";

function App() {
  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white">
      <Toolbar />
      <div className="flex-1 flex min-h-0">
        {/* Left: Code Editor */}
        <div className="w-1/2 border-r border-zinc-800">
          <CodeEditor />
        </div>
        {/* Right: Explanation Panel */}
        <div className="w-1/2">
          <ExplanationPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
