"use client";
import React, { useEffect, useState } from "react";
import { Coffee } from "lucide-react";
import { Header } from "@/components/Header";
import { StepStrip } from "@/components/StepStrip";
import { CoffeeModal } from "@/components/CoffeeModal";
import { SuggestModal } from "@/components/SuggestModal";
import { SponsorSection } from "@/components/SponsorSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [coffeeOpen, setCoffeeOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  // Sync modals with URL hash (#qr / #suggest) or query param (?modal=qr / ?modal=suggest)
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.replace(/^#/, "").toLowerCase();
      const modalParam = new URLSearchParams(window.location.search)
        .get("modal")
        ?.toLowerCase();
      const target = hash || modalParam || "";

      if (target === "qr" || target === "coffee" || target === "donate") {
        setCoffeeOpen(true);
        setSuggestOpen(false);
      } else if (
        target === "suggest" ||
        target === "feature" ||
        target === "feedback"
      ) {
        setSuggestOpen(true);
        setCoffeeOpen(false);
      }
    };

    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    return () => window.removeEventListener("hashchange", syncFromUrl);
  }, []);

  const openCoffee = () => {
    setCoffeeOpen(true);
    window.history.replaceState(null, "", "#qr");
  };

  const closeCoffee = () => {
    setCoffeeOpen(false);
    if (window.location.hash || window.location.search.includes("modal=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const openSuggest = () => {
    setSuggestOpen(true);
    window.history.replaceState(null, "", "#suggest");
  };

  const closeSuggest = () => {
    setSuggestOpen(false);
    if (window.location.hash || window.location.search.includes("modal=")) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <main className="w-full max-w-[35rem] mx-auto flex flex-col min-h-[100dvh]">

      {/* ── Hero & Header ───────────────────────────────────── */}
      <Header onOpenSuggest={openSuggest} />

      {/* ── 3-Step How It Works Strip ────────────────────────── */}
      <StepStrip />

      {/* ── Coffee Donation Card ─────────────────────────────── */}
      <div className="w-full px-4 mb-5">
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-semibold text-[#FAFAFA] mb-0.5">Like the tool?</p>
            <p className="text-xs text-[#71717A] leading-relaxed">Support the developer with a coffee ☕</p>
          </div>
          <button
            onClick={openCoffee}
            className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-semibold bg-[#1C1C20] text-[#F59E0B] border border-[#F59E0B]/30 hover:bg-[#F59E0B]/10 hover:border-[#F59E0B]/60 active:scale-[0.98] transition-all"
          >
            <Coffee className="w-3.5 h-3.5" />
            Click to see QR code
          </button>
        </div>
      </div>

      {/* ── Suggest a Feature Card ───────────────────────────── */}
      <div className="w-full px-4 mb-5">
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-xs font-semibold text-[#FAFAFA] mb-0.5">Got an idea?</p>
            <p className="text-xs text-[#71717A] leading-relaxed">Feature requests are always welcome!</p>
          </div>
          <button
            onClick={openSuggest}
            className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-full text-xs font-semibold bg-[#1C1C20] text-[#FAFAFA] border border-[#27272A] hover:bg-[#222227] hover:border-[#3F3F46] active:scale-[0.98] transition-all"
          >
            💡 Suggest a Feature
          </button>
        </div>
      </div>

      {/* ── Sponsor / Ads Under Construction ────────────────── */}
      <SponsorSection />

      {/* ── Footer ──────────────────────────────────────────── */}
      <Footer />

      {/* ── Modals ──────────────────────────────────────────── */}
      <CoffeeModal isOpen={coffeeOpen} onClose={closeCoffee} />
      <SuggestModal isOpen={suggestOpen} onClose={closeSuggest} />
    </main>
  );
}

