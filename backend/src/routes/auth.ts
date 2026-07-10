import type { FastifyInstance } from "fastify";

const MOCK_USER = {
  id: "user-1",
  email: "test@gmail.com",
  password: "test@123",
  name: "Test User",
};

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/api/login", async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    if (email !== MOCK_USER.email || password !== MOCK_USER.password) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    return reply.send({
      success: true,
      token: `mock-token-${Date.now()}`,
      user: {
        id: MOCK_USER.id,
        email: MOCK_USER.email,
        name: MOCK_USER.name,
      },
    });
  });
}
