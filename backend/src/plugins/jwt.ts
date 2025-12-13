import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";

export default fp(async (app: FastifyInstance) => {
  // Access token (default: app.jwt)
  await app.register(jwt, {
    secret: app.config.JWT_ACCESS_SECRET,
  });

  // Refresh token helpers (külön secret-tel, ugyanazon app.jwt instance-en)
  app.decorate("signRefreshJwt", (payload: object) =>
    app.jwt.sign(payload, { secret: app.config.JWT_REFRESH_SECRET })
  );

  app.decorate("verifyRefreshJwt", (token: string) =>
    app.jwt.verify(token, { secret: app.config.JWT_REFRESH_SECRET })
  );
});

declare module "fastify" {
  interface FastifyInstance {
    signRefreshJwt: (payload: object) => string;
    verifyRefreshJwt: (token: string) => any;
  }
}
