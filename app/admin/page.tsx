import { redirect } from "next/navigation";

// /admin → redirect to first dashboard tab
export default function AdminRoot() {
  redirect("/admin/qr");
}
