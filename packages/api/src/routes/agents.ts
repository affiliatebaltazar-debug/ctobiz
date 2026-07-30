import { Hono } from "hono";
import { db, schema } from "../db";
import { aiAgents as agentDefinitions } from "../data/agents";
import { eq } from "drizzle-orm";

const agentsRoute = new Hono();

// GET / — list all agents
agentsRoute.get("/", (c) => {
  try {
    const dbAgents = db.select().from(schema.aiAgents).all();

    const agents = agentDefinitions.map((def) => {
      const dbRecord = dbAgents.find((a) => a.id === def.id);
      return {
        ...def,
        tasksCompleted: dbRecord?.tasksCompleted ?? 0,
        errors: dbRecord?.errors ?? 0,
        performanceScore: dbRecord?.performanceScore ?? 0,
        lastRun: dbRecord?.lastRun ?? null,
        dbStatus: dbRecord?.status ?? def.status,
      };
    });

    return c.json({ agents, total: agents.length });
  } catch {
    return c.json({ agents: agentDefinitions, total: agentDefinitions.length });
  }
});

// GET /:id — get single agent
agentsRoute.get("/:id", (c) => {
  const id = c.req.param("id");
  const def = agentDefinitions.find((a) => a.id === id);

  if (!def) {
    return c.json({ error: "Agent not found" }, 404);
  }

  try {
    const dbRecord = db
      .select()
      .from(schema.aiAgents)
      .where(eq(schema.aiAgents.id, id))
      .get();

    return c.json({
      ...def,
      tasksCompleted: dbRecord?.tasksCompleted ?? 0,
      errors: dbRecord?.errors ?? 0,
      performanceScore: dbRecord?.performanceScore ?? 0,
      lastRun: dbRecord?.lastRun ?? null,
      dbStatus: dbRecord?.status ?? def.status,
    });
  } catch {
    return c.json(def);
  }
});

// POST /:id/run — trigger an agent run (placeholder)
agentsRoute.post("/:id/run", (c) => {
  const id = c.req.param("id");
  const def = agentDefinitions.find((a) => a.id === id);

  if (!def) {
    return c.json({ error: "Agent not found" }, 404);
  }

  const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return c.json({
    taskId,
    agentId: id,
    agentName: def.name,
    status: "queued",
    message: `Agent "${def.name}" has been queued for execution.`,
    timestamp: new Date().toISOString(),
  });
});

export default agentsRoute;
