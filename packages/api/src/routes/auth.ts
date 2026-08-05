import { Hono } from "hono";
import { db, sqlite, schema } from "../db";
import { eq } from "drizzle-orm";
import { authMiddleware, createSession, type AuthUser } from "../middleware/auth";

const authRoute = new Hono();

// ── POST /api/v1/auth/register ──
authRoute.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, organizationName } = body;

    // Validate input
    if (!email || !password || !name || !organizationName) {
      return c.json(
        { error: "Sva polja su obavezna: email, password, name, organizationName." },
        400,
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Neispravan format email adrese." }, 400);
    }

    // Validate password length
    if (password.length < 8) {
      return c.json({ error: "Lozinka mora imati najmanje 8 znakova." }, 400);
    }

    // Validate name length
    if (name.trim().length < 1) {
      return c.json({ error: "Ime je obavezno." }, 400);
    }

    // Validate organization name length
    if (organizationName.trim().length < 1) {
      return c.json({ error: "Naziv organizacije je obavezan." }, 400);
    }

    // Check if email already exists
    const existing = sqlite
      .query("SELECT id FROM users WHERE email = ?")
      .get(email.toLowerCase().trim()) as { id: string } | undefined;

    if (existing) {
      return c.json({ error: "Korisnik s tom email adresom već postoji." }, 409);
    }

    // Hash password
    const passwordHash = await Bun.password.hash(password);

    // Create user
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    sqlite
      .query(
        `INSERT INTO users (id, email, password_hash, name, organization_name, role, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'admin', ?, ?)`,
      )
      .run(userId, email.toLowerCase().trim(), passwordHash, name.trim(), organizationName.trim(), now, now);

    // Create session token
    const token = await createSession(userId);

    const user: AuthUser = {
      id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      organizationName: organizationName.trim(),
      role: "admin",
    };

    return c.json({ user, token }, 201);
  } catch (err) {
    console.error("Register error:", err);
    return c.json({ error: "Greška pri registraciji." }, 500);
  }
});

// ── POST /api/v1/auth/login ──
authRoute.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json(
        { error: "Email i lozinka su obavezni." },
        400,
      );
    }

    // Find user by email
    const user = sqlite
      .query(
        "SELECT id, email, password_hash, name, organization_name, role FROM users WHERE email = ?",
      )
      .get(email.toLowerCase().trim()) as {
      id: string;
      email: string;
      password_hash: string;
      name: string;
      organization_name: string;
      role: string;
    } | undefined;

    if (!user) {
      return c.json({ error: "Neispravan email ili lozinka." }, 401);
    }

    // Verify password
    const valid = await Bun.password.verify(password, user.password_hash);

    if (!valid) {
      return c.json({ error: "Neispravan email ili lozinka." }, 401);
    }

    // Create session token
    const token = await createSession(user.id);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      organizationName: user.organization_name,
      role: user.role as "admin" | "member",
    };

    return c.json({ user: authUser, token });
  } catch (err) {
    console.error("Login error:", err);
    return c.json({ error: "Greška pri prijavi." }, 500);
  }
});

// ── GET /api/v1/auth/me ──
authRoute.get("/me", authMiddleware, (c) => {
  const user = c.get("user") as AuthUser;
  return c.json({ user });
});

// ── POST /api/v1/auth/api-keys ──
authRoute.post("/api-keys", authMiddleware, async (c) => {
  try {
    const user = c.get("user") as AuthUser;
    const body = await c.req.json();
    const { name } = body;

    if (!name || name.trim().length < 1) {
      return c.json({ error: "Naziv API ključa je obavezan." }, 400);
    }

    // Generate a random API key: b44_ + 32 hex chars
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const keySuffix = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const apiKey = `b44_${keySuffix}`;

    // Hash the key with SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const keyPrefix = apiKey.slice(0, 11); // "b44_" + first 7 hex chars

    const keyId = crypto.randomUUID();
    const now = new Date().toISOString();

    sqlite
      .query(
        `INSERT INTO api_keys (id, user_id, name, key_hash, key_prefix, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(keyId, user.id, name.trim(), keyHash, keyPrefix, now, now);

    return c.json(
      {
        id: keyId,
        name: name.trim(),
        key: apiKey,
        keyPrefix,
        createdAt: now,
      },
      201,
    );
  } catch (err) {
    console.error("Create API key error:", err);
    return c.json({ error: "Greška pri kreiranju API ključa." }, 500);
  }
});

// ── GET /api/v1/auth/api-keys ──
authRoute.get("/api-keys", authMiddleware, (c) => {
  try {
    const user = c.get("user") as AuthUser;

    const keys = sqlite
      .query(
        "SELECT id, name, key_prefix, last_used_at, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC",
      )
      .all(user.id) as {
      id: string;
      name: string;
      key_prefix: string;
      last_used_at: string | null;
      created_at: string;
    }[];

    return c.json({
      apiKeys: keys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.key_prefix,
        lastUsedAt: k.last_used_at,
        createdAt: k.created_at,
      })),
    });
  } catch (err) {
    console.error("List API keys error:", err);
    return c.json({ error: "Greška pri dohvaćanju API ključeva." }, 500);
  }
});

// ── DELETE /api/v1/auth/api-keys/:id ──
authRoute.delete("/api-keys/:id", authMiddleware, (c) => {
  try {
    const user = c.get("user") as AuthUser;
    const keyId = c.req.param("id") ?? "";

    // Verify the key belongs to the user
    const key = sqlite
      .query("SELECT id, user_id FROM api_keys WHERE id = ?")
      .get(keyId) as { id: string; user_id: string } | undefined;

    if (!key) {
      return c.json({ error: "API ključ nije pronađen." }, 404);
    }

    if (key.user_id !== user.id) {
      return c.json({ error: "Nemate dozvolu za brisanje ovog API ključa." }, 403);
    }

    sqlite.query("DELETE FROM api_keys WHERE id = ?").run(keyId);

    return c.json({ message: "API ključ uspješno obrisan." });
  } catch (err) {
    console.error("Delete API key error:", err);
    return c.json({ error: "Greška pri brisanju API ključa." }, 500);
  }
});

export default authRoute;
