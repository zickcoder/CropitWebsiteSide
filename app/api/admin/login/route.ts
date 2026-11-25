import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createAdminSession } from "@/lib/admin-auth";
import { getAdminUserByEmail, getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    // Dev mode: no Supabase configured — allow thacoj@gmail.com + "dev" password
    const supabase = getSupabase();
    if (!supabase) {
      const devEmail = process.env.DEV_ADMIN_EMAIL || "thacoj@gmail.com";
      const devPassword = process.env.DEV_ADMIN_PASSWORD || "dev";
      const emailMatch = email.trim().toLowerCase() === devEmail.toLowerCase();
      const passMatch = password === devPassword;
      if (!emailMatch || !passMatch) {
        return NextResponse.json(
          { error: "Incorrect email or password." },
          { status: 401 }
        );
      }
      const token = createAdminSession();
      const res = NextResponse.json({ success: true });
      res.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    // Production: look up admin_users table
    const user = await getAdminUserByEmail(email.trim());
    if (!user) {
      // Generic message — don't reveal whether the email exists
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    const token = createAdminSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("/api/admin/login error:", err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
