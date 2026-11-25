import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
  getQrProviders,
  saveQrProviders,
  getSupabase,
  QrProviderKey,
} from "@/lib/supabase";

const VALID_PROVIDERS: QrProviderKey[] = ["gcash", "maya", "qrph"];

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isValidProvider(p: unknown): p is QrProviderKey {
  return typeof p === "string" && VALID_PROVIDERS.includes(p as QrProviderKey);
}

/** GET /api/admin/qr — returns all QR providers (admin-protected) */
export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  const providers = await getQrProviders();
  return NextResponse.json({ providers });
}

/** POST /api/admin/qr — uploads a QR image for a specific provider (gcash | maya | qrph) */
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const providerRaw = formData.get("provider") || "gcash";

    if (!isValidProvider(providerRaw)) {
      return NextResponse.json(
        { error: "Invalid provider. Must be gcash, maya, or qrph." },
        { status: 400 }
      );
    }
    const provider: QrProviderKey = providerRaw;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, WEBP, or GIF files are allowed." },
        { status: 400 }
      );
    }

    const maxSizeBytes = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "File is too large (max 2 MB)." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const providers = await getQrProviders();
    let finalUrl: string | null = null;
    let storageType = "database";

    // 1. Try Supabase Storage first
    const supabase = getSupabase();
    if (supabase) {
      try {
        const ext = file.type.split("/")[1] || "png";
        const path = `qr/${provider}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("cropitgif-assets")
          .upload(path, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("cropitgif-assets").getPublicUrl(path);
          finalUrl = `${publicUrl}?v=${Date.now()}`;
          storageType = "supabase";
        } else {
          console.warn(
            "Supabase Storage upload failed, falling back to base64:",
            uploadError.message
          );
        }
      } catch (err) {
        console.warn("Supabase Storage error, falling back to base64:", err);
      }
    }

    // 2. Fallback: base64 data URL
    if (!finalUrl) {
      finalUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
    }

    providers[provider] = {
      ...providers[provider],
      url: finalUrl,
    };

    const result = await saveQrProviders(providers);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to save QR code." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      providers,
      storage: result.devMode ? "memory" : storageType,
    });
  } catch (err: any) {
    console.error("/api/admin/qr POST error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

/** PATCH /api/admin/qr — toggle Show / Hide for a provider on the main website */
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!verifyAdminSession(token)) return unauthorized();

  try {
    const { provider, visible } = await req.json();

    if (!isValidProvider(provider)) {
      return NextResponse.json({ error: "Invalid provider." }, { status: 400 });
    }
    if (typeof visible !== "boolean") {
      return NextResponse.json(
        { error: "visible must be a boolean." },
        { status: 400 }
      );
    }

    const providers = await getQrProviders();
    providers[provider] = {
      ...providers[provider],
      visible,
    };

    const result = await saveQrProviders(providers);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to update visibility." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, providers });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
