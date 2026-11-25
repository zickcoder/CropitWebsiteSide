"use client";
import React from "react";
import { Chrome, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  onOpenSuggest: () => void;
}

export function Header({ onOpenSuggest }: HeaderProps) {
  return (
    <header className="w-full flex flex-col items-center text-center pt-8 pb-6 px-4">
      {/* Top micro badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#1C1C20] text-[#A1A1AA] border border-[#27272A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          version 1.0 Beta
        </span>
      </div>

      {/* Minimalist cropitGIF Logo */}
      <div className="flex items-center gap-2.5 mb-3 select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="cropitGIF logo"
          className="w-8 h-8 rounded-lg object-contain border border-[#27272A] bg-[#1C1C20]"
        />

        <div className="flex items-center tracking-tight">
          <span className="text-xl font-bold text-[#FAFAFA] font-sans">cropit</span>
          <span className="text-xl font-extrabold text-[#141416] bg-[#F59E0B] px-1.5 py-0.5 rounded ml-1 text-sm tracking-wide">
            GIF
          </span>
        </div>
      </div>

      {/* One-line clean description */}
      <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-[28.75rem] mx-auto mb-5 font-normal">
        Crop any area of your browser tab and record it straight into a lightweight GIF—100% locally with zero bloat.
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <a
          href="https://chromewebstore.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#FAFAFA] text-[#141416] hover:bg-[#E4E4E7] active:scale-[0.98] transition-all shadow-sm"
        >
          <Chrome className="w-4 h-4 text-[#141416]" />
          <span>Add to Chrome — Free</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#52525B]" />
        </a>

        <button
          onClick={onOpenSuggest}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-[#1C1C20] text-[#FAFAFA] border border-[#27272A] hover:bg-[#222227] hover:border-[#3F3F46] active:scale-[0.98] transition-all"
        >
          <span>💡 Suggest a Feature</span>
        </button>
      </div>
    </header>
  );
}
