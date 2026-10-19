import "./env.js";
import { serve } from "@hono/node-server";
import app from "./app.js";

// Local API server; Vite proxies /api here (see vite.config.ts).
const port = Number(process.env.API_PORT ?? 3001);

serve({ fetch: app.fetch, port }, () => console.log(`API em http://localhost:${port}/api`));
