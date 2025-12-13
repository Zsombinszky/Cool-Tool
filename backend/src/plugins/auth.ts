import fp from "fastify-plugin";
import type { FastifyRequest } from "fastify";

export default fp(async (app) => {
  app.decorate("authenticate", async (req: FastifyRequest) => {
    await req.jwtVerify();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest) => Promise<void>;
  }
}
