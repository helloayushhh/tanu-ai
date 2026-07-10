import type { FastifyInstance } from "fastify";
import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import store from "../lib/store.js";
import { parseResume } from "../lib/resume-parser.js";
import { logger } from "../lib/logger.js";
import { fetchJobsFromAdzuna } from "../lib/adzuna.js";
import { batchMatchJobs } from "../lib/matching.js";

export async function registerResumeRoutes(app: FastifyInstance) {
  app.get("/api/resume", async (_request, reply) => {
    // Prototype: load persisted resume once if memory is empty.
    if (!store.resume?.hasResume) {
      try {
        const dataDir = path.resolve(process.cwd(), "data", "resumes");
        const file = path.join(dataDir, "default.json");
        const raw = await readFile(file, "utf-8");
        const parsed = JSON.parse(raw);
        store.resume = parsed;
      } catch {
        // ignore (no saved resume)
      }
    }

    return reply.send(store.resume);
  });

  app.post("/api/upload-resume", async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: "No file provided" });
      }

      const chunks: Buffer[] = [];
      for await (const chunk of data.file) {
        chunks.push(chunk as Buffer);
      }
      const buffer = Buffer.concat(chunks);

      const { text, skills } = await parseResume(buffer, data.mimetype, data.filename);

      const resumeState = {
        hasResume: true,
        filename: data.filename,
        extractedText: text,
        skills,
        uploadedAt: new Date().toISOString(),
      };

      store.resume = resumeState;

      // Technical skills in JSON format (required) + persist to disk.
      const technicalSkillsJson = {
        skills,
        generatedAt: new Date().toISOString(),
      };

      const dataDir = path.resolve(process.cwd(), "data", "resumes");
      await mkdir(dataDir, { recursive: true });
      const outFile = path.join(dataDir, "default.json");
      await writeFile(
        outFile,
        JSON.stringify({ ...resumeState, technicalSkillsJson }, null, 2),
        "utf-8"
      );

      // Clear jobs cache to force reload with new skill matching on next request
      store.jobs = [];
      store.jobsFetchedAt = null;

      // After upload: recommend jobs based on extracted technical skills
      const roleQuery = skills.slice(0, 6).join(" ") || "developer";
      const location = "india";
      const jobs = await fetchJobsFromAdzuna(roleQuery, location);
      const matchedJobs = await batchMatchJobs(jobs as any, text, skills);
      const recommendedJobs = matchedJobs.slice(0, 6);

      logger.info(
        {
          filename: data.filename,
          skillCount: skills.length,
          recommendedCount: recommendedJobs.length,
        },
        "Resume uploaded, skills persisted, and matches computed"
      );

      return reply.send({
        ...store.resume,
        technicalSkillsJson,
        recommendedJobs,
      });
    } catch (err) {
      logger.error({ err }, "Resume upload failed");
      return reply.status(500).send({ error: "Failed to process resume" });
    }
  });
}
