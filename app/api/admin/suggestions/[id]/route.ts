import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { updateSuggestionStatus, deleteSuggestion } from "@/lib/supabase";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** PATCH /api/admin/suggestions/[id] — update status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["New", "Planned", "Done"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const result = await updateSuggestionStatus(id, status);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

/** DELETE /api/admin/suggestions/[id] — delete a suggestion */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  const { id } = await params;
  const result = await deleteSuggestion(id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

