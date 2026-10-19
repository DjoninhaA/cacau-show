import { existsSync } from "node:fs";
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net";

// Local runs read .env.local / .env; on Vercel the variables are already set.
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

// Node gives each IPv4/IPv6 address only 250 ms to connect; on slower links every
// attempt to Neon times out (ETIMEDOUT / "fetch failed"). Allow 2 s per address.
setDefaultAutoSelectFamilyAttemptTimeout(2000);
