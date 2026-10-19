import { existsSync } from "node:fs";

// Local runs read .env.local / .env; on Vercel the variables are already set.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}
