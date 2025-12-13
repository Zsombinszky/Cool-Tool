import fp from "fastify-plugin";
import env from "@fastify/env";

const schema = {
  type: "object",
  required: [
    "PORT",
    "FRONTEND_ORIGIN",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ],
  properties: {
    NODE_ENV: { type: "string", default: "development" },
    PORT: { type: "string", default: "4000" },
    FRONTEND_ORIGIN: { type: "string" },

    JWT_ACCESS_SECRET: { type: "string" },
    JWT_REFRESH_SECRET: { type: "string" },

    COOKIE_SECURE: { type: "string", default: "false" },
    COOKIE_SAMESITE: { type: "string", default: "lax" },
  },
} as const;

export default fp(async (app) => {
  await app.register(env, { schema, dotenv: true });
});

declare module "fastify" {
  interface FastifyInstance {
    config: {
      NODE_ENV: string;
      PORT: string;
      FRONTEND_ORIGIN: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      COOKIE_SECURE: string;
      COOKIE_SAMESITE: string;
    };
  }
}
