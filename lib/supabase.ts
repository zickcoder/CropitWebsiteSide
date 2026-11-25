import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface SuggestionRecord {
  id?: string;
  name: string;
  email: string;
  suggestion: string;
  status?: "New" | "Planned" | "Done";
  created_at?: string;
}

export interface AdminUser {
  id?: string;
  email: string;
  password_hash: string;
  created_at?: string;
}

// ─── In-memory mock store (dev fallback, shared across Next.js dev route chunks) ─
const globalForMock = globalThis as unknown as {
  __cropitMockSuggestions?: SuggestionRecord[];
  __cropitMockSettings?: Record<string, string>;
  __cropitMockAdminUsers?: AdminUser[];
};

const mockSuggestions: SuggestionRecord[] =
  (globalForMock.__cropitMockSuggestions ??= []);
const mockSettings: Record<string, string> =
  (globalForMock.__cropitMockSettings ??= {});
const mockAdminUsers: AdminUser[] =
  (globalForMock.__cropitMockAdminUsers ??= []);

// ─── Supabase client singleton ───────────────────────────────────────────────
let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(url, key, { auth: { persistSession: false } });
  }
  return supabaseClient;
}

// ─── Admin Users ─────────────────────────────────────────────────────────────
export async function getAdminUserByEmail(
  email: string
): Promise<AdminUser | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (error) {
      console.error("getAdminUserByEmail error:", error);
      return null;
    }
    return data ?? null;
  }
  return mockAdminUsers.find((u) => u.email === email.trim().toLowerCase()) ?? null;
}

export async function hasAnyAdminUser(): Promise<boolean> {
  const supabase = getSupabase();
  if (supabase) {
    const { count, error } = await supabase
      .from("admin_users")
      .select("*", { count: "exact", head: true });
    if (error) return false;
    return (count ?? 0) > 0;
  }
  return mockAdminUsers.length > 0;
}

export async function createAdminUser(
  email: string,
  passwordHash: string
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const supabase = getSupabase();
  const cleanEmail = email.trim().toLowerCase();
  if (supabase) {
    const { error } = await supabase.from("admin_users").insert([
      { email: cleanEmail, password_hash: passwordHash },
    ]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  mockAdminUsers.push({ email: cleanEmail, password_hash: passwordHash });
  return { success: true, devMode: true };
}

// ─── Suggestions (public: create) ────────────────────────────────────────────
export async function saveSuggestion(data: {
  name: string;
  email: string;
  suggestion: string;
}): Promise<{ success: boolean; data?: SuggestionRecord; error?: string; devMode?: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: inserted, error } = await supabase
        .from("suggestions")
        .insert([
          {
            name: data.name,
            email: data.email,
            suggestion: data.suggestion,
            status: "New",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();
      if (error) return { success: false, error: error.message };
      return { success: true, data: inserted };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
  const newRecord: SuggestionRecord = {
    id: `mock-${Date.now()}`,
    name: data.name,
    email: data.email,
    suggestion: data.suggestion,
    status: "New",
    created_at: new Date().toISOString(),
  };
  mockSuggestions.push(newRecord);
  console.log("[cropitGIF DEV] New suggestion (in-memory):", newRecord);
  return { success: true, data: newRecord, devMode: true };
}

// ─── Suggestions (admin: read / update / delete) ─────────────────────────────
export async function getAllSuggestions(): Promise<{
  data: SuggestionRecord[];
  devMode?: boolean;
}> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("getAllSuggestions error:", error);
      return { data: [] };
    }
    return { data: data ?? [] };
  }
  return { data: [...mockSuggestions].reverse(), devMode: true };
}

export async function updateSuggestionStatus(
  id: string,
  status: "New" | "Planned" | "Done"
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("suggestions")
      .update({ status })
      .eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  const rec = mockSuggestions.find((s) => s.id === id);
  if (rec) rec.status = status;
  return { success: true, devMode: true };
}

export async function deleteSuggestion(
  id: string
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("suggestions").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  const idx = mockSuggestions.findIndex((s) => s.id === id);
  if (idx !== -1) mockSuggestions.splice(idx, 1);
  return { success: true, devMode: true };
}

// ─── Site Settings ────────────────────────────────────────────────────────────
export async function getSiteSetting(key: string): Promise<string | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) {
      console.error("getSiteSetting error:", error);
      return null;
    }
    return data?.value ?? null;
  }
  return mockSettings[key] ?? null;
}

export async function setSiteSetting(
  key: string,
  value: string
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("site_settings").upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  mockSettings[key] = value;
  console.log(`[cropitGIF DEV] site_settings.${key} set (in-memory)`);
  return { success: true, devMode: true };
}

// ─── Multi-Provider QR Settings (GCash / Maya / QR Ph) ────────────────────────
export type QrProviderKey = "gcash" | "maya" | "qrph";

export interface QrProviderConfig {
  url: string | null;
  visible: boolean;
}

export type QrProvidersState = Record<QrProviderKey, QrProviderConfig>;

const DEFAULT_QR_PROVIDERS: QrProvidersState = {
  gcash: { url: null, visible: true },
  maya: { url: null, visible: true },
  qrph: { url: null, visible: true },
};

export async function getQrProviders(): Promise<QrProvidersState> {
  const raw = await getSiteSetting("qr_providers");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        gcash: {
          url: parsed?.gcash?.url ?? null,
          visible: parsed?.gcash?.visible ?? true,
        },
        maya: {
          url: parsed?.maya?.url ?? null,
          visible: parsed?.maya?.visible ?? true,
        },
        qrph: {
          url: parsed?.qrph?.url ?? null,
          visible: parsed?.qrph?.visible ?? true,
        },
      };
    } catch {
      // fall through to default
    }
  }

  // Backward compatibility with single qr_image_url
  const legacyUrl = await getSiteSetting("qr_image_url");
  return {
    ...DEFAULT_QR_PROVIDERS,
    gcash: { url: legacyUrl ?? null, visible: true },
  };
}

export async function saveQrProviders(
  providers: QrProvidersState
): Promise<{ success: boolean; error?: string; devMode?: boolean }> {
  return setSiteSetting("qr_providers", JSON.stringify(providers));
}
