import crypto from "crypto";

const OTP_SECRET = process.env.OTP_SECRET || "cropitgif-super-secret-key-32chars!";
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Generate a cryptographically secure 6-digit OTP
 */
export function generateOtp(): string {
  const num = crypto.randomInt(100000, 999999);
  return num.toString();
}

/**
 * Creates a signed token containing the email, OTP, and expiration timestamp.
 * Token format: base64(email:otp:expiresAt:signature)
 */
export function createOtpToken(email: string, otp: string): { token: string; expiresAt: number } {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = Date.now() + OTP_EXPIRY_MS;
  const payload = `${normalizedEmail}:${otp}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
  const token = Buffer.from(`${payload}:${hmac}`).toString("base64");
  return { token, expiresAt };
}

/**
 * Verifies if the provided OTP matches the signed token for the given email
 */
export function verifyOtpToken(
  token: string,
  email: string,
  enteredOtp: string
): { valid: boolean; reason?: string } {
  try {
    if (!token) return { valid: false, reason: "No verification token provided" };
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length !== 4) return { valid: false, reason: "Malformed token" };

    const [tokenEmail, tokenOtp, tokenExpiresAt, tokenSignature] = parts;
    const normalizedEmail = email.trim().toLowerCase();

    if (tokenEmail !== normalizedEmail) {
      return { valid: false, reason: "Email does not match OTP token" };
    }

    const expiresAt = parseInt(tokenExpiresAt, 10);
    if (Date.now() > expiresAt) {
      return { valid: false, reason: "OTP has expired. Please request a new code." };
    }

    const payload = `${tokenEmail}:${tokenOtp}:${tokenExpiresAt}`;
    const expectedSignature = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(tokenSignature), Buffer.from(expectedSignature))) {
      return { valid: false, reason: "Invalid signature" };
    }

    if (tokenOtp !== enteredOtp.trim()) {
      return { valid: false, reason: "Incorrect 6-digit code. Please check and try again." };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, reason: "Invalid verification token" };
  }
}
