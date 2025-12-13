import crypto from "crypto";

export function newTokenId() {
  return crypto.randomUUID();
}

export function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}
