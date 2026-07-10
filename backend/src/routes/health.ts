import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/api/healthz", async (_request, reply) => {
    return reply.send({ status: "ok" });
  });
}
