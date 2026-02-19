import Editor from "@monaco-editor/react";
import { useTraceStore } from "../store/useTracestore";
import { useRef, useEffect } from "react";

export function CodeEditor() {
    const { code, setCode, hoveredLine } = useTraceStore();
    const editorRef = useRef<any>(null);
    const decorationsRef = useRef<any>([]);

    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
    }

    // Highlight line on hover
    useEffect(() => {
        if (!editorRef.current) return;
        const editor = editorRef.current;

        if (hoveredLine) {
            decorationsRef.current = editor.deltaDecorations(
                decorationsRef.current,
                [
                    {
                        range: { startLineNumber: hoveredLine, startColumn: 1, endLineNumber: hoveredLine, endColumn: 1 },
                        options: {
                            isWholeLine: true,
                            className: "highlighted-line",
                            glyphMarginClassName: "highlighted-glyph",
                        },
                    },
                ]
            );
        } else {
            decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
        }
    }, [hoveredLine]);

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || "")}
                onMount={handleEditorDidMount}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                }}
            />
        </div>
    );
}
