import type { FastifyInstance } from "fastify";

import { registerAuthRoutes } from "./auth.js";
import { registerResumeRoutes } from "./resume.js";
import { registerJobRoutes } from "./jobs.js";
import { registerApplicationRoutes } from "./applications.js";
import { registerMatchRoutes } from "./match.js";
import { registerHealthRoutes } from "./health.js";
import { registerAiRoutes } from "./ai.js";

export async function registerRoutes(app: FastifyInstance) {
  await registerHealthRoutes(app);
  await registerAuthRoutes(app);
  await registerResumeRoutes(app);
  await registerJobRoutes(app);        // ✅ IMPORTANT (jobs route)
  await registerMatchRoutes(app);
  await registerApplicationRoutes(app);
  await registerAiRoutes(app);
}