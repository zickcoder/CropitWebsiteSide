import { NextResponse } from "next/server";
import { getQrProviders } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Public endpoint — returns QR providers (URL + visible flag) */
export async function GET() {
  const providers = await getQrProviders();
  return NextResponse.json(
    { providers },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
