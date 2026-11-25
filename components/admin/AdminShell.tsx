"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  QrCode,
  Lightbulb,
  Megaphone,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/qr", icon: <QrCode className="w-4 h-4" />, label: "QR Code Image" },
  { href: "/admin/suggestions", icon: <Lightbulb className="w-4 h-4" />, label: "Suggestions" },
  { href: "/admin/ads", icon: <Megaphone className="w-4 h-4" />, label: "Ads / Sponsor" },
];

function SidebarContent({
  pathname,
  onLogout,
  onClose,
}: {
  pathname: string;
  onLogout: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand Header */}
      <div className="px-4 pt-5 pb-4 border-b border-[#27272A]">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#FAFAFA] block leading-tight">
              cropitGIF
            </span>
            <span className="text-[9px] text-[#71717A] font-medium uppercase tracking-widest">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                active
                  ? "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20"
                  : "text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]"
              }`}
            >
              <span className={active ? "text-[#F59E0B]" : "text-[#71717A]"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-2 py-3 border-t border-[#27272A] space-y-0.5">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#71717A] hover:bg-[#27272A] hover:text-[#FAFAFA] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Site
        </Link>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#71717A] hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#141416] flex">
      {/* ── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[220px] flex-shrink-0 bg-[#1C1C20] border-r border-[#27272A] sticky top-0 h-screen">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* ── Mobile Sidebar Overlay ────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-[220px] bg-[#1C1C20] border-r border-[#27272A] flex flex-col md:hidden transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          pathname={pathname}
          onLogout={handleLogout}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-[#1C1C20] border-b border-[#27272A]">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-[#FAFAFA]">
            cropitGIF <span className="text-[#F59E0B]">Admin</span>
          </span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

