import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

const url = process.env.DATABASE_URL;
if (!url) {
  const state = url === undefined ? "is not set" : "is empty";
  throw new Error(`DATABASE_URL ${state} (VERCEL_ENV=${process.env.VERCEL_ENV ?? "-"})`);
}

export const db = drizzle(neon(url), { schema });
