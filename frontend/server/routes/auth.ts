import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { requireAuth, type AuthEnv } from "../auth/middleware.js";
import { hashPassword, verifyPassword } from "../auth/password.js";
import { createSession, deleteSession, SESSION_COOKIE } from "../auth/session.js";
import { validate } from "../validator.js";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z.string(),
});

// Compared against when the e-mail doesn't exist, so both failures take the same time.
const dummyHash = hashPassword("dummy-password");

export const authRoutes = new Hono<AuthEnv>()
  .post("/login", validate("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    const valid = await verifyPassword(password, user?.passwordHash ?? (await dummyHash));
    if (!user || !valid) return c.json({ error: "INVALID_CREDENTIALS" } as const, 401);

    const { token, expiresAt } = await createSession(user.id);
    setCookie(c, SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      expires: expiresAt,
    });
    return c.json({ name: user.name, email: user.email }, 200);
  })
  .post("/logout", async (c) => {
    const token = getCookie(c, SESSION_COOKIE);
    if (token) await deleteSession(token);
    deleteCookie(c, SESSION_COOKIE, { path: "/" });
    return c.body(null, 204);
  })
  .get("/me", requireAuth, (c) => {
    const { name, email } = c.var.user;
    return c.json({ name, email }, 200);
  });
