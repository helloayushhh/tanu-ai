import type { FastifyInstance } from "fastify";
import store from "../lib/store.js";
import { batchMatchJobs } from "../lib/matching.js";

export async function registerMatchRoutes(app: FastifyInstance) {
  app.post("/api/match-jobs", async (request, reply) => {
    const body = request.body as { jobs?: any[] };

    if (!store.resume?.hasResume || !store.resume.extractedText) {
      return reply.status(400).send({ error: "Upload a resume first" });
    }

    const jobsToMatch = Array.isArray(body.jobs) ? body.jobs : store.jobs;
    if (!Array.isArray(jobsToMatch) || jobsToMatch.length === 0) {
      return reply.status(400).send({ error: "No jobs provided to match" });
    }

    const matched = await batchMatchJobs(
      jobsToMatch as any,
      store.resume.extractedText,
      store.resume.skills
    );

    return reply.send({
      jobs: matched,
      total: matched.length,
    });
  });
}

