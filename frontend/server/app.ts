import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";
import { authRoutes } from "./routes/auth.js";
import { resellerRoutes } from "./routes/resellers.js";

const app = new Hono()
  .basePath("/api")
  .use(secureHeaders(), csrf())
  .route("/auth", authRoutes)
  .route("/resellers", resellerRoutes);

app.notFound((c) => c.json({ error: "NOT_FOUND" }, 404));
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse(); // e.g. csrf() rejecting a cross-site request
  console.error(err);
  return c.json({ error: "INTERNAL_ERROR" }, 500);
});

export default app;
export type AppType = typeof app;
