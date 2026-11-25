import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";
import { AdminShell } from "./AdminShell";

/**
 * Server component — wraps any admin dashboard page.
 * Checks the signed session cookie; redirects to /admin/login if invalid or missing.
 * The /admin/login page does NOT use this wrapper, breaking the redirect loop.
 */
export async function AuthedAdminPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!verifyAdminSession(session?.value)) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}

