import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import Fastify from "fastify";

import { registerRoutes } from "./routes/index.js";

// This module is only used for TS typechecking (build entrypoint is `src/index.ts`).
export async function createApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    // Allow local dev + preview across different ports.
    origin: true,
  });

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.get("/", async () => {
    return { message: "Backend is running 🚀" };
  });

  await registerRoutes(app);
  return app;
}