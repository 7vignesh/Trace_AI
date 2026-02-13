import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use("/*", cors());

app.get("/", (c) => c.json({ status: "TraceAI API is running" }));

export default {
    port: 3001,
    fetch: app.fetch,
};
