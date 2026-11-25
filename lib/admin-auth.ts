import crypto, { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// ─── Session tokens ───────────────────────────────────────────────────────────
const ADMIN_SECRET =
  process.env.ADMIN_SECRET || "cropitgif-admin-secret-change-me-in-production";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createAdminSession(): string {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `admin:${expires}`;
  const sig = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [role, expiresStr, sig] = parts;
    if (role !== "admin") return false;
    if (Date.now() > parseInt(expiresStr, 10)) return false;
    const payload = `${role}:${expiresStr}`;
    const expectedSig = crypto
      .createHmac("sha256", ADMIN_SECRET)
      .update(payload)
      .digest("hex");
    if (sig.length !== expectedSig.length) return false;
    return timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}

// ─── Password hashing (scrypt — no extra deps) ────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const colonIdx = storedHash.indexOf(":");
    if (colonIdx === -1) return false;
    const salt = storedHash.slice(0, colonIdx);
    const key = storedHash.slice(colonIdx + 1);
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const keyBuffer = Buffer.from(key, "hex");
    if (derivedKey.length !== keyBuffer.length) return false;
    return timingSafeEqual(derivedKey, keyBuffer);
  } catch {
    return false;
  }
}
