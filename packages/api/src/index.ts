import { Hono } from "hono";
import { cors } from "hono/cors";
import agentsRoute from "./routes/agents";
import campaignsRoute from "./routes/campaigns";
import leadsRoute from "./routes/leads";
import analyticsRoute from "./routes/analytics";
import healthRoute from "./routes/health";
import authRoute from "./routes/auth";

const app = new Hono();

// CORS — allow the Vite dev server
app.use(
  "*",
  cors({
    origin: ["http://localhost:3100", "http://localhost:3000"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
  }),
);

// API v1 routes
const v1 = new Hono();
v1.route("/auth", authRoute);
v1.route("/agents", agentsRoute);
v1.route("/campaigns", campaignsRoute);
v1.route("/leads", leadsRoute);
v1.route("/analytics", analyticsRoute);
v1.route("/health", healthRoute);

app.route("/api/v1", v1);

// Root — API info
app.get("/", (c) => {
  return c.json({
    name: "Base44 API",
    version: "0.1.0",
    docs: "/api/v1/health",
    endpoints: [
      "POST /api/v1/auth/register",
      "POST /api/v1/auth/login",
      "GET  /api/v1/auth/me",
      "POST /api/v1/auth/api-keys",
      "GET  /api/v1/auth/api-keys",
      "DELETE /api/v1/auth/api-keys/:id",
      "GET  /api/v1/health",
      "GET  /api/v1/agents",
      "GET  /api/v1/agents/:id",
      "POST /api/v1/agents/:id/run",
      "GET  /api/v1/campaigns",
      "POST /api/v1/campaigns",
      "GET  /api/v1/campaigns/:id",
      "GET  /api/v1/leads",
      "POST /api/v1/leads",
      "GET  /api/v1/analytics/overview",
    ],
  });
});

const port = parseInt(process.env.PORT || "3001", 10);

console.log(`🚀 Base44 API server running on http://localhost:${port}`);

Bun.serve({ port, fetch: app.fetch });
