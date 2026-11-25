"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Eye, EyeOff, AlertCircle, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Incorrect email or password.");
        setLoading(false);
        return;
      }

      router.push("/admin/qr");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141416] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#1C1C20] border border-[#27272A] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-[#FAFAFA]">Admin Sign In</h1>
          <p className="text-xs text-[#71717A] mt-1">cropitGIF dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525B]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="thacoj@gmail.com"
                  disabled={loading}
                  required
                  autoFocus
                  autoComplete="email"
                  className="w-full bg-[#141416] border border-[#27272A] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B]/60 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your admin password"
                  disabled={loading}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#141416] border border-[#27272A] rounded-xl px-3 py-2.5 pr-10 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B]/60 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Dev mode hint */}
            <div className="px-3 py-2 rounded-xl bg-[#141416] border border-[#27272A] text-[11px] text-[#52525B] leading-relaxed">
              <span className="text-[#71717A] font-medium">No Supabase?</span> Use{" "}
              <code className="text-[#F59E0B]">thacoj@gmail.com</code> and password{" "}
              <code className="text-[#F59E0B]">dev</code> for local dev mode.
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-[#F59E0B] text-[#141416] hover:bg-[#FBBF24] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#52525B] mt-4">
          cropitGIF Admin · Private access only
        </p>
      </div>
    </div>
  );
}
