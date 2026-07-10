import "dotenv/config";

import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";

import { registerRoutes } from "./routes/index.js";

const fastify = Fastify({ logger: true });

// Root check
fastify.get("/", async () => {
  return { message: "Backend is running 🚀" };
});

// CORS
await fastify.register(cors, {
  origin: true,
});

// Multipart
await fastify.register(multipart);

// Register all routes
await registerRoutes(fastify);

// Debug routes
console.log(fastify.printRoutes());

// ✅ IMPORTANT FIX HERE
const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3001;

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0", // 🔥 THIS FIXES YOUR RENDER ERROR
    });

    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();