import { Hono } from "hono";
import { cors } from "hono/cors";
import agentsRoute from "./routes/agents";
import campaignsRoute from "./routes/campaigns";
import leadsRoute from "./routes/leads";
import leadActionsRoute from "./routes/lead-actions";
import analyticsRoute from "./routes/analytics";
import healthRoute from "./routes/health";
import authRoute from "./routes/auth";
import billingRoute from "./routes/billing";

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
v1.route("/leads", leadActionsRoute);
v1.route("/analytics", analyticsRoute);
v1.route("/health", healthRoute);
v1.route("/billing", billingRoute);

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
      "GET  /api/v1/leads/:id",
      "POST /api/v1/leads/:id/enrich",
      "POST /api/v1/leads/:id/score",
      "POST /api/v1/leads/:id/notes",
      "GET  /api/v1/leads/:id/timeline",
      "POST /api/v1/leads/:id/status",
      "POST /api/v1/leads/:id/actions/generate-message",
      "POST /api/v1/leads/:id/actions/generate-outreach",
      "POST /api/v1/leads/:id/actions/ai-recommendation",
      "GET  /api/v1/analytics/overview",
      "GET  /api/v1/analytics/advanced",
      "POST /api/v1/billing/checkout",
      "GET  /api/v1/billing/subscription",
      "POST /api/v1/billing/webhook",
    ],
  });
});

const port = parseInt(process.env.PORT || "3001", 10);

console.log(`🚀 Base44 API server running on http://localhost:${port}`);

Bun.serve({ port, fetch: app.fetch });
