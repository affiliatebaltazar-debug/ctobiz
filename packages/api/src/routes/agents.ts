import { Hono } from "hono";
import { db, schema } from "../db";
import { aiAgents as agentDefinitions } from "../data/agents";
import { eq } from "drizzle-orm";
import { chat, getModel } from "../services/ai";
import { getAgentPrompt } from "../services/prompts";
import { authMiddleware, type AuthUser } from "../middleware/auth";
import { checkAgentAccess } from "../middleware/tiers";

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

// POST /:id/run — trigger an agent run with AI
// Auth required; agents outside the user's tier are rejected (403).
agentsRoute.post("/:id/run", authMiddleware, checkAgentAccess, async (c) => {
  const user = c.get("user") as AuthUser;
  const id = c.req.param("id") ?? "";
  const def = agentDefinitions.find((a) => a.id === id);

  if (!def) {
    return c.json({ error: "Agent nije pronađen" }, 404);
  }

  let body: { task?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Neispravno JSON tijelo — pošalji { task: '...' }" }, 400);
  }

  if (!body.task || typeof body.task !== "string") {
    return c.json({ error: "Nedostaje polje 'task' u tijelu zahtjeva" }, 400);
  }

  const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Insert pending task record
  try {
    db.insert(schema.agentTasks).values({
      id: taskId,
      agentId: id,
      userId: user.id,
      task: body.task,
      status: "running",
    }).run();
  } catch {
    // DB write is best-effort for now; continue with AI call
  }

  try {
    const systemPrompt = getAgentPrompt(def.id, def.category);
    const result = await chat(systemPrompt, body.task);

    // Update task record with result
    try {
      db.update(schema.agentTasks)
        .set({ result, status: "completed", updatedAt: new Date().toISOString() })
        .where(eq(schema.agentTasks.id, taskId))
        .run();
    } catch {
      // best-effort
    }

    return c.json({
      taskId,
      agentId: id,
      agentName: def.name,
      result,
      model: getModel(),
      status: "completed",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const errorMessage = err?.message || "Nepoznata greška";

    // Update task record with error
    try {
      db.update(schema.agentTasks)
        .set({ result: errorMessage, status: "failed", updatedAt: new Date().toISOString() })
        .where(eq(schema.agentTasks.id, taskId))
        .run();
    } catch {
      // best-effort
    }

    return c.json({
      taskId,
      agentId: id,
      error: errorMessage,
      status: "failed",
      timestamp: new Date().toISOString(),
    }, errorMessage.includes("AI_API_KEY") ? 503 : 500);
  }
});

export default agentsRoute;
