import { NextRequest, NextResponse } from "next/server";
import { generateOtp, createOtpToken } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim().toLowerCase();

    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP and signed token
    const otp = generateOtp();
    const { token, expiresAt } = createOtpToken(cleanEmail, otp);

    // Send email
    const emailResult = await sendOtpEmail(cleanEmail, otp);

    const response = NextResponse.json({
      success: true,
      message: "Verification code sent to your email.",
      token, // token is signed HMAC with expiration timestamp
      expiresAt,
      devMode: emailResult.devMode,
      devCode: emailResult.devCode, // helpful in dev mode when SMTP not set
    });

    // Also set an HTTP-only cookie for verification persistence
    response.cookies.set("cropit_otp_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Error in /api/send-otp:", err);
    return NextResponse.json(
      { error: "Failed to send OTP code. Please try again." },
      { status: 500 }
    );
  }
}
