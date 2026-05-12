import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { userRoutes } from "./routes/user.route";
import { postRoutes } from "./routes/post.route";

const app = new Hono();
app.get("/health", (c) => c.json({ ok: true }));
app.get("/users/:id", (c) => c.json({ ok: true, op: "GET /users/:id" }));
app.post("/users", (c) => c.json({ ok: true, op: "POST /users" }));
app.post("/auth/login", (c) => c.json({ ok: true, op: "POST /auth/login" }));
app.get("/health", (c) => c.json({ ok: true, op: "GET /health" }));
app.route("/users", userRoutes);
app.route("/posts", postRoutes);
const port = Number(process.env.PORT ?? 8080);
const server = serve({ fetch: app.fetch, port });
console.log(JSON.stringify({ level: "info", msg: "listening", port }));

// Graceful shutdown. @hono/node-server exposes the underlying Node server
// via the returned object — we call close() to stop accepting connections,
// then force-exit if in-flight requests overrun the grace window.
function shutdown(signal: string) {
  console.log(JSON.stringify({ level: "info", msg: "shutdown", signal }));
  server.close((err) => {
    if (err) {
      console.error(JSON.stringify({ level: "error", msg: "shutdown failed", err: String(err) }));
      process.exit(1);
    }
    process.exit(0);
  });
  setTimeout(() => {
    console.error(JSON.stringify({ level: "error", msg: "shutdown timed out — forcing exit" }));
    process.exit(1);
  }, 25_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
