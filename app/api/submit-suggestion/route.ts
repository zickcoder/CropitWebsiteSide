import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/otp";
import { saveSuggestion } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, otp, token: bodyToken, suggestion } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Please enter your name." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter your email." },
        { status: 400 }
      );
    }

    if (!otp || !otp.trim() || otp.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please enter the 6-digit verification code sent to your email." },
        { status: 400 }
      );
    }

    if (!suggestion || !suggestion.trim() || suggestion.trim().length < 5) {
      return NextResponse.json(
        { error: "Please write a suggestion (at least 5 characters)." },
        { status: 400 }
      );
    }

    // Check token from body or from HTTP-only cookie
    const cookieToken = req.cookies.get("cropit_otp_token")?.value;
    const token = bodyToken || cookieToken;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token missing or expired. Please click 'Send OTP' first." },
        { status: 400 }
      );
    }

    const verification = verifyOtpToken(token, email, otp);
    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.reason || "Invalid or expired verification code." },
        { status: 400 }
      );
    }

    // OTP is valid! Save suggestion
    const saveResult = await saveSuggestion({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      suggestion: suggestion.trim(),
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error || "Failed to save suggestion. Please try again." },
        { status: 500 }
      );
    }

    // Clear verification cookie upon successful submission
    const response = NextResponse.json({
      success: true,
      message: `Thanks ${name.trim()}! Your idea has been sent to the developer.`,
      devMode: saveResult.devMode,
    });

    response.cookies.delete("cropit_otp_token");

    return response;
  } catch (err: any) {
    console.error("Error in /api/submit-suggestion:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
