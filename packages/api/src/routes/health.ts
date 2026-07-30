import { Hono } from "hono";

const healthRoute = new Hono();

healthRoute.get("/", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    agentCount: 24,
    version: "0.1.0",
    service: "Base44 API",
  });
});

export default healthRoute;
