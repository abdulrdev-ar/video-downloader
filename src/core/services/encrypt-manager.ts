import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "saveit-dev-only-secret";

function secret(): string {
  const value = process.env.STREAM_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("STREAM_SECRET is not set");
  }
  return DEV_SECRET;
}

function hmac(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

/**
 * Signs short-lived tokens so `/internal/stream` only fetches URLs this server
 * extracted itself. The payload is readable by the client; it is not secret,
 * only tamper-proof.
 */
export const SignatureManager = {
  sign(payload: object, ttlMs: number, now = Date.now()): string {
    const body = Buffer.from(
      JSON.stringify({ ...payload, exp: now + ttlMs })
    ).toString("base64url");
    return `${body}.${hmac(body)}`;
  },

  verify<T>(token: string, now = Date.now()): T | null {
    const [body, signature] = token.split(".");
    if (!body || !signature) return null;

    const expected = Buffer.from(hmac(body));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
      return null;
    }

    try {
      const payload = JSON.parse(Buffer.from(body, "base64url").toString());
      return typeof payload.exp === "number" && payload.exp > now
        ? (payload as T)
        : null;
    } catch {
      return null;
    }
  },
};
