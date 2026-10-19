import { Hono } from "hono";
import { z } from "zod";
import { resellerInputSchema } from "../../shared/resellerSchema.js";
import { requireAuth, type AuthEnv } from "../auth/middleware.js";
import * as repo from "../repositories/resellers.js";
import { validate } from "../validator.js";

// A malformed id can't match any reseller, so it is reported as NOT_FOUND.
const idParam = validate("param", z.object({ id: z.uuid() }), "NOT_FOUND");
const notFound = { error: "NOT_FOUND" } as const;

// Authorship always comes from the session, never from the request body.
export const resellerRoutes = new Hono<AuthEnv>()
  .use(requireAuth)
  .get("/", async (c) => c.json(await repo.listResellers(), 200))
  .post("/", validate("json", resellerInputSchema), async (c) => {
    const reseller = await repo.createReseller(c.req.valid("json"), c.var.user.id);
    return c.json(reseller, 201);
  })
  .put("/:id", idParam, validate("json", resellerInputSchema), async (c) => {
    const reseller = await repo.updateReseller(c.req.valid("param").id, c.req.valid("json"), c.var.user.id);
    return reseller ? c.json(reseller, 200) : c.json(notFound, 404);
  })
  .delete("/:id", idParam, async (c) => {
    const deleted = await repo.deleteReseller(c.req.valid("param").id, c.var.user.id);
    return deleted ? c.body(null, 204) : c.json(notFound, 404);
  })
  .post("/:id/restore", idParam, async (c) => {
    const reseller = await repo.restoreReseller(c.req.valid("param").id, c.var.user.id);
    return reseller ? c.json(reseller, 200) : c.json(notFound, 404);
  });
