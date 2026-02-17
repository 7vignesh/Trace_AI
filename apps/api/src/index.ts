import { Hono } from "hono";
import { cors } from "hono/cors";
import { explainRouter } from "./routes/explain";

const app = new Hono();

app.use("/*", cors({ origin: "http://localhost:3000" }));

app.get("/", (c) => c.json({ status: "TraceAI API running" }));
app.route("/api", explainRouter);

export default {
  port: 3001,
  fetch: app.fetch,
};
