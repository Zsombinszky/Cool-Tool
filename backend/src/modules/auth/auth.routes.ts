import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { registerSchema } from "./auth.schemas.js";
import { hashPassword } from "./auth.service.js";
import { loginSchema } from "./auth.schemas.js";
import {
  issueTokens,
  rotateRefresh,
  revokeRefreshByTokenId,
  verifyPassword,
} from "./auth.service.js";

const refreshCookieName = "refreshToken";

function cookieOptions(app: any) {
  const secure =
    app.config.COOKIE_SECURE === "true" || app.config.NODE_ENV === "production";
  const sameSite = (app.config.COOKIE_SAMESITE || "lax") as
    | "lax"
    | "strict"
    | "none";

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: "/api/auth",
  } as const;
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  // POST /api/auth/register
  app.post("/register", async (req, reply) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ message: "Invalid input", details: parsed.error.flatten() });
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return reply.code(409).send({ message: "Email already in use" });

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, passwordHash, name, role: "user" },
    });

    const { accessToken, refreshToken } = await issueTokens(app, user);
    reply.setCookie(refreshCookieName, refreshToken, cookieOptions(app));

    return reply.code(201).send({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  // POST /api/auth/login
  app.post("/login", async (req, reply) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply
        .code(400)
        .send({ message: "Invalid input", details: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.code(401).send({ message: "Invalid credentials" });

    const ok = await verifyPassword(user.passwordHash, password);
    if (!ok) return reply.code(401).send({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = await issueTokens(app, user);

    reply.setCookie(refreshCookieName, refreshToken, cookieOptions(app));
    return reply.send({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  });

  // POST /api/auth/refresh
  app.post("/refresh", async (req, reply) => {
    const token = (req.cookies as any)?.[refreshCookieName];
    if (!token) return reply.code(204).send();

    let payload: any;
    try {
      payload = await app.verifyRefreshJwt(token);
    } catch {
      return reply.code(401).send({ message: "Invalid refresh token" });
    }

    const rotated = await rotateRefresh(app, payload);
    if (!rotated) return reply.code(401).send({ message: "Refresh failed" });

    reply.setCookie(
      refreshCookieName,
      rotated.refreshToken,
      cookieOptions(app)
    );
    return reply.send({ accessToken: rotated.accessToken });
  });

  // POST /api/auth/logout
  app.post("/logout", async (req, reply) => {
    const token = (req.cookies as any)?.[refreshCookieName];
    if (token) {
      try {
        const payload: any = await app.verifyRefreshJwt(token);
        if (payload?.tid) await revokeRefreshByTokenId(payload.tid);
      } catch {
        // ignore
      }
    }

    reply.clearCookie(refreshCookieName, cookieOptions(app));
    return reply.send({ ok: true });
  });

  // GET /api/auth/me
  app.get("/me", { preHandler: app.authenticate }, async (req: any) => {
    const u = req.user as { sub: string; email: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: u.sub } });
    if (!user) return { user: null };

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  });
};
