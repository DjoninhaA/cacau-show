import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { getSessionUser, SESSION_COOKIE, type SessionUser } from "./session.js";

export type AuthEnv = { Variables: { user: SessionUser } };

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE);
  const user = token ? await getSessionUser(token) : null;
  if (!user) return c.json({ error: "UNAUTHORIZED" } as const, 401);
  c.set("user", user);
  await next();
});
