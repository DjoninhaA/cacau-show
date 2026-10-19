import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";

// zValidator that answers with the API error format instead of the raw Zod issues.
export const validate = <T extends ZodType, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
  error: "VALIDATION_ERROR" | "NOT_FOUND" = "VALIDATION_ERROR",
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) return c.json({ error }, error === "NOT_FOUND" ? 404 : 400);
  });
