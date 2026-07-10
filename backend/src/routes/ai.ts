import type { FastifyInstance } from "fastify";
import store from "../lib/store.js";
import { processAiChat } from "../lib/ai-graph.js";

export async function registerAiRoutes(app: FastifyInstance) {
  app.post("/api/ai-chat", async (request, reply) => {
    const { message, conversationId } = request.body as {
      message: string;
      conversationId?: string;
    };

    if (!message) {
      return reply.status(400).send({ error: "message is required" });
    }

    const convId = conversationId || `conv-${Date.now()}`;
    const history = store.conversations.get(convId) || [];

    const { reply: aiReply, action, filterUpdates, jobRecommendations } =
      await processAiChat(message, history);

    history.push({ role: "user", content: message });
    history.push({ role: "assistant", content: aiReply });

    if (history.length > 20) {
      history.splice(0, 2);
    }

    store.conversations.set(convId, history);

    return reply.send({
      reply: aiReply,
      action: action || "none",
      filterUpdates: filterUpdates || {},
      jobRecommendations,
      conversationId: convId,
    });
  });
}