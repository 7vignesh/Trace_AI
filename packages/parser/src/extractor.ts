import traverse from "@babel/traverse";
import type { Node } from "@babel/types";
import { parseCode } from "./parser";

export interface FlowNode {
  line: number;
  endLine?: number;
  type: string;
  name?: string;
  detail?: string;
}

export function extractFlow(code: string): FlowNode[] {
  const ast = parseCode(code);
  const flow: FlowNode[] = [];

  traverse(ast, {
    VariableDeclaration(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      const declarations = path.node.declarations
        .map((d) => (d.id.type === "Identifier" ? d.id.name : "unknown"))
        .join(", ");
      flow.push({
        line,
        type: "variable_declaration",
        name: declarations,
        detail: path.node.kind, // let, const, var
      });
    },

    FunctionDeclaration(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({
        line,
        endLine: path.node.loc?.end.line,
        type: "function_declaration",
        name: path.node.id?.name ?? "anonymous",
      });
    },

    ArrowFunctionExpression(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({
        line,
        endLine: path.node.loc?.end.line,
        type: "arrow_function",
      });
    },

    ForStatement(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({
        line,
        endLine: path.node.loc?.end.line,
        type: "for_loop",
      });
    },

    WhileStatement(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({
        line,
        endLine: path.node.loc?.end.line,
        type: "while_loop",
      });
    },

    IfStatement(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({
        line,
        endLine: path.node.loc?.end.line,
        type: "conditional",
      });
    },

    ReturnStatement(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({ line, type: "return" });
    },

    CallExpression(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      const callee = path.node.callee;
      let name = "unknown";
      if (callee.type === "Identifier") name = callee.name;
      if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
        name = callee.property.name;
      }
      flow.push({ line, type: "function_call", name });
    },

    AwaitExpression(path) {
      const line = path.node.loc?.start.line;
      if (!line) return;
      flow.push({ line, type: "await_expression" });
    },
  });

  // Sort by line number
  flow.sort((a, b) => a.line - b.line);
  return flow;
}
