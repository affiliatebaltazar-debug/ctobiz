import type { Context, Next } from "hono";
import { db, sqlite, schema } from "../db";
import { eq } from "drizzle-orm";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  organizationName: string;
  role: "admin" | "member";
}

/**
 * Required auth middleware — rejects with 401 if no valid token.
 * Attaches `user` to context via `c.set('user', user)`.
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Nedostaje autorizacijski token." }, 401);
  }

  const token = authHeader.slice(7);

  try {
    // Hash the token to look up the session
    const tokenHash = await hashToken(token);

    // Query sessions table for a valid, non-expired session
    const session = sqlite
      .query(
        `SELECT s.user_id, s.expires_at, u.id, u.email, u.name, u.organization_name, u.role
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ?`,
      )
      .get(tokenHash) as {
      user_id: string;
      expires_at: string;
      id: string;
      email: string;
      name: string;
      organization_name: string;
      role: string;
    } | undefined;

    if (!session) {
      return c.json({ error: "Nevažeći token." }, 401);
    }

    if (new Date(session.expires_at) < new Date()) {
      // Clean up expired session
      sqlite.query("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
      return c.json({ error: "Token je istekao." }, 401);
    }

    const user: AuthUser = {
      id: session.id,
      email: session.email,
      name: session.name,
      organizationName: session.organization_name,
      role: session.role as "admin" | "member",
    };

    c.set("user", user);
    await next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return c.json({ error: "Greška pri autentifikaciji." }, 500);
  }
}

/**
 * Optional auth middleware — sets user if a valid token is present,
 * but does NOT reject the request if missing or invalid.
 */
export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const tokenHash = await hashToken(token);

      const session = sqlite
        .query(
          `SELECT s.user_id, s.expires_at, u.id, u.email, u.name, u.organization_name, u.role
           FROM sessions s
           JOIN users u ON u.id = s.user_id
           WHERE s.token_hash = ?`,
        )
        .get(tokenHash) as {
        user_id: string;
        expires_at: string;
        id: string;
        email: string;
        name: string;
        organization_name: string;
        role: string;
      } | undefined;

      if (session && new Date(session.expires_at) >= new Date()) {
        const user: AuthUser = {
          id: session.id,
          email: session.email,
          name: session.name,
          organizationName: session.organization_name,
          role: session.role as "admin" | "member",
        };
        c.set("user", user);
      }
    } catch {
      // Silently ignore auth errors for optional auth
    }
  }

  await next();
}

/**
 * Hash a session token with SHA-256 for storage lookup.
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Create a session for a user and return the plaintext token.
 * The token is a random 64-char hex string.
 */
export async function createSession(userId: string): Promise<string> {
  // Generate a random 64-char hex token
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const tokenHash = await hashToken(token);

  // Calculate expiry: 7 days from now
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  sqlite.query(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)",
  ).run(crypto.randomUUID(), userId, tokenHash, expiresAt);

  return token;
}

/**
 * Delete a session by token (for logout).
 */
export async function deleteSession(token: string): Promise<void> {
  const tokenHash = await hashToken(token);
  sqlite.query("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}
