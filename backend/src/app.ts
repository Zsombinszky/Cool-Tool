import Fastify from "fastify";
import envPlugin from "./plugins/env.js";
import corsPlugin from "./plugins/cors.js";
import cookiePlugin from "./plugins/cookie.js";
import jwtPlugin from "./plugins/jwt.js";
import authPlugin from "./plugins/auth.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { prisma } from "./lib/prisma.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(envPlugin);
  await app.register(corsPlugin);
  await app.register(cookiePlugin);
  await app.register(jwtPlugin);
  await app.register(authPlugin);

  app.get("/health", async () => ({ ok: true }));

  app.get("/db/health", async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  });

  await app.register(
    async (api) => {
      await api.register(authRoutes, { prefix: "/auth" });
    },
    { prefix: "/api" }
  );

  return app;
}
