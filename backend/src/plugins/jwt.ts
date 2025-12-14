import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyInstance } from "fastify";

type JwtWithSecret = {
  sign: (
    payload: object,
    options?: { secret?: string } & Record<string, any>
  ) => string;
  verify: (
    token: string,
    options?: { secret?: string } & Record<string, any>
  ) => any;
};

export default fp(async (app: FastifyInstance) => {
  await app.register(jwt, {
    secret: app.config.JWT_ACCESS_SECRET,
  });

  const jwtAny = app.jwt as unknown as JwtWithSecret;

  app.decorate("signRefreshJwt", (payload: object) =>
    jwtAny.sign(payload, { secret: app.config.JWT_REFRESH_SECRET })
  );

  app.decorate("verifyRefreshJwt", (token: string) =>
    jwtAny.verify(token, { secret: app.config.JWT_REFRESH_SECRET })
  );
});

declare module "fastify" {
  interface FastifyInstance {
    signRefreshJwt: (payload: object) => string;
    verifyRefreshJwt: (token: string) => any;
  }
}
