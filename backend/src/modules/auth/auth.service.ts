import argon2 from "argon2";
import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma.js";
import { addDays, newTokenId } from "../../lib/tokens.js";

const REFRESH_DAYS = 30;

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function hashPassword(password: string) {
  return argon2.hash(password);
}

type PublicUser = {
  id: string;
  email: string;
  role: string;
  name?: string | null;
};

export async function issueTokens(app: FastifyInstance, user: PublicUser) {
  const accessToken = app.jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    { expiresIn: "15m" }
  );

  const tokenId = newTokenId();
  const expiresAt = addDays(REFRESH_DAYS);

  await prisma.refreshToken.create({
    data: { tokenId, userId: user.id, expiresAt },
  });

  const refreshToken = app.signRefreshJwt({
    sub: user.id,
    tid: tokenId,
    type: "refresh",
  });

  return { accessToken, refreshToken, refreshExpiresAt: expiresAt };
}

export async function rotateRefresh(app: FastifyInstance, refreshJwt: any) {
  if (refreshJwt?.type !== "refresh" || !refreshJwt?.sub || !refreshJwt?.tid)
    return null;

  const token = await prisma.refreshToken.findUnique({
    where: { tokenId: refreshJwt.tid },
  });
  if (!token) return null;
  if (token.revokedAt) return null;
  if (token.expiresAt.getTime() < Date.now()) return null;

  // revoke old
  await prisma.refreshToken.update({
    where: { tokenId: refreshJwt.tid },
    data: { revokedAt: new Date() },
  });

  const user = await prisma.user.findUnique({ where: { id: refreshJwt.sub } });
  if (!user) return null;

  return issueTokens(app, user);
}

export async function revokeRefreshByTokenId(tokenId: string) {
  await prisma.refreshToken.updateMany({
    where: { tokenId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}
