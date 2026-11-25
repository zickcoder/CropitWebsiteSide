import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/admin-auth";
import { hasAnyAdminUser, createAdminUser, getSupabase } from "@/lib/supabase";

/**
 * One-time setup endpoint.
 * Creates the first admin user. Returns 403 if any admin already exists.
 * Call once: POST /api/admin/setup { email, password }
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then run this endpoint again.",
        },
        { status: 503 }
      );
    }

    // Guard: only allow if no admin users exist yet
    const alreadySetup = await hasAnyAdminUser();
    if (alreadySetup) {
      return NextResponse.json(
        {
          error:
            "Admin account already exists. This setup endpoint is locked. To reset, delete all rows from the admin_users table in Supabase.",
        },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(password);
    const result = await createAdminUser(email.trim(), passwordHash);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create admin user." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Admin account created for ${email.trim()}. This endpoint is now locked.`,
    });
  } catch (err) {
    console.error("/api/admin/setup error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

