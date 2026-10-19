// Applies the migrations in server/db/migrations over HTTP (same driver as the API).
//   npm run db:migrate
import "../server/env.js";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { db } from "../server/db/client.js";

try {
  await migrate(db, { migrationsFolder: "server/db/migrations" });
  console.log("Migrations aplicadas.");
} catch (err) {
  console.error("Falha ao aplicar migrations:", err instanceof Error ? (err.cause instanceof Error ? err.cause.message : err.message) : err);
  process.exitCode = 1;
}
