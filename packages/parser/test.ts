import { extractFlow } from "./src";
const code = `const x = 5;\nfor (let i = 0; i < x; i++) {\n  console.log(i);\n}`;
console.log(JSON.stringify(extractFlow(code), null, 2));
