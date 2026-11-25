import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllSuggestions } from "@/lib/supabase";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** GET /api/admin/suggestions — returns all suggestions */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  const result = await getAllSuggestions();
  return NextResponse.json({ suggestions: result.data, devMode: result.devMode });
}

