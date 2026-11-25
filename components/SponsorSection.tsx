"use client";
import React from "react";
import { Construction } from "lucide-react";

export function SponsorSection() {
  return (
    <div className="w-full px-4 mb-5">
      <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAFA] mb-0.5">Sponsor Me / Put Ads</h3>
            <p className="text-xs text-[#71717A] leading-relaxed max-w-[320px]">
              Ad &amp; sponsor slots for cropitGIF are currently being built. Check back soon!
            </p>
          </div>
          {/* Under Construction badge */}
          <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141416] border border-[#27272A]">
            <Construction className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[11px] font-semibold text-[#F59E0B] whitespace-nowrap">
              Under Construction
            </span>
          </div>
        </div>

        {/* Placeholder slots */}
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-14 rounded-lg border border-dashed border-[#27272A] bg-[#141416] flex flex-col items-center justify-center gap-1 opacity-40"
            >
              <span className="text-[9px] font-medium text-[#71717A] uppercase tracking-widest">Slot {i}</span>
              <span className="text-[9px] text-[#52525B]">Reserved</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#52525B] mt-3 text-center leading-relaxed">
          Interested in sponsoring a slot?{" "}
          <a
            href="mailto:sponsor@cropitgif.vercel.app"
            className="text-[#F59E0B]/70 hover:text-[#F59E0B] transition-colors underline underline-offset-2"
          >
            Get in touch
          </a>
        </p>
      </div>
    </div>
  );
}

