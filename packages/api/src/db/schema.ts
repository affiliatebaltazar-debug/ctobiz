import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ── AI Agents ──
export const aiAgents = sqliteTable("ai_agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["active", "idle", "configuring"] })
    .notNull()
    .default("idle"),
  capabilities: text("capabilities"), // JSON array
  instructions: text("instructions"),
  lastRun: text("last_run"),
  tasksCompleted: integer("tasks_completed").default(0),
  errors: integer("errors").default(0),
  performanceScore: real("performance_score").default(0),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Marketing Campaigns ──
export const marketingCampaigns = sqliteTable("marketing_campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  objective: text("objective").notNull(),
  budget: real("budget"),
  targetAudience: text("target_audience"), // JSON
  keywords: text("keywords"), // JSON array
  status: text("status", {
    enum: ["draft", "active", "paused", "completed", "archived"],
  })
    .notNull()
    .default("draft"),
  results: text("results"), // JSON
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Content Items ──
export const contentItems = sqliteTable("content_items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type", {
    enum: ["post", "video", "story", "ad", "article", "email"],
  }).notNull(),
  platform: text("platform").notNull(),
  topic: text("topic"),
  script: text("script"),
  caption: text("caption"),
  hashtags: text("hashtags"), // JSON array
  status: text("status", {
    enum: ["draft", "review", "scheduled", "published"],
  })
    .notNull()
    .default("draft"),
  scheduledDate: text("scheduled_date"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Leads ──
export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  platform: text("platform"),
  source: text("source"),
  interest: text("interest"),
  problem: text("problem"),
  offer: text("offer"),
  priority: text("priority", {
    enum: ["low", "medium", "high", "critical"],
  })
    .notNull()
    .default("medium"),
  status: text("status", {
    enum: ["new", "contacted", "qualified", "converted", "rejected"],
  })
    .notNull()
    .default("new"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Competitors ──
export const competitors = sqliteTable("competitors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  socialProfiles: text("social_profiles"), // JSON
  keywords: text("keywords"), // JSON array
  analysis: text("analysis"),
  score: real("score").default(0),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── SEO Projects ──
export const seoProjects = sqliteTable("seo_projects", {
  id: text("id").primaryKey(),
  website: text("website").notNull(),
  keywords: text("keywords"), // JSON
  backlinks: integer("backlinks").default(0),
  ranking: text("ranking"), // JSON
  auditScore: real("audit_score").default(0),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Automations ──
export const automations = sqliteTable("automations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(),
  action: text("action").notNull(),
  status: text("status", { enum: ["active", "paused", "error"] })
    .notNull()
    .default("paused"),
  frequency: text("frequency"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Analytics Records ──
export const analyticsRecords = sqliteTable("analytics_records", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(),
  views: integer("views").default(0),
  clicks: integer("clicks").default(0),
  engagement: real("engagement").default(0),
  conversions: integer("conversions").default(0),
  revenue: real("revenue").default(0),
  date: text("date").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Users ──
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  organizationName: text("organization_name").notNull(),
  role: text("role", { enum: ["admin", "member"] })
    .notNull()
    .default("admin"),
  // ── Subscription / billing ──
  tier: text("tier", { enum: ["starter", "pro", "agency"] })
    .notNull()
    .default("starter"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status", {
    enum: ["inactive", "active", "past_due", "canceled"],
  })
    .notNull()
    .default("inactive"),
  subscriptionCurrentPeriodEnd: text("subscription_current_period_end"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── API Keys ──
export const apiKeys = sqliteTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  lastUsedAt: text("last_used_at"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Agent Tasks ──
export const agentTasks = sqliteTable("agent_tasks", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull(),
  userId: text("user_id").notNull(),
  task: text("task").notNull(),
  context: text("context"),
  result: text("result"),
  status: text("status", {
    enum: ["pending", "running", "completed", "failed"],
  })
    .notNull()
    .default("pending"),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
});

// ── Sessions ──
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});
