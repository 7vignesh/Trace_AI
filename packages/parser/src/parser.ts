import { parse } from "@babel/parser";

export function parseCode(code: string) {
  return parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
    errorRecovery: true,
  });
}
