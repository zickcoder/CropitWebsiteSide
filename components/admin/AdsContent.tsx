"use client";
import React from "react";
import { Megaphone, Construction, Link2, ToggleLeft } from "lucide-react";
import { ImageIcon } from "lucide-react";

export function AdsContent() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#F59E0B]" />
          Ads / Sponsor
        </h1>
        <p className="text-xs text-[#71717A] mt-1">Sponsor and banner placement controls for the public site.</p>
      </div>

      <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-5 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Construction className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-[#FAFAFA]">Under Construction</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] uppercase tracking-widest">🚧 Coming Soon</span>
            </div>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Ad &amp; sponsor placement controls are currently under construction. Once enabled, banners configured here will sync directly to the website and extension.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-5 opacity-60 select-none">
        <p className="text-xs font-semibold text-[#71717A] uppercase tracking-widest mb-4">Future sponsor form — preview only</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5">Sponsor Name</label>
            <input disabled placeholder="e.g. Acme Corp" className="w-full bg-[#141416]/60 border border-[#27272A]/60 rounded-xl px-3 py-2 text-xs text-[#52525B] placeholder:text-[#3F3F46] cursor-not-allowed" readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" />Banner Image Upload</label>
            <div className="border border-dashed border-[#27272A]/60 rounded-xl p-6 flex flex-col items-center gap-2 cursor-not-allowed bg-[#141416]/40">
              <ImageIcon className="w-6 h-6 text-[#3F3F46]" />
              <span className="text-[11px] text-[#3F3F46]">Upload disabled · Coming soon</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#71717A] mb-1.5 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5" />Target URL</label>
            <input type="url" disabled placeholder="https://your-sponsor.com" className="w-full bg-[#141416]/60 border border-[#27272A]/60 rounded-xl px-3 py-2 text-xs text-[#52525B] placeholder:text-[#3F3F46] cursor-not-allowed" readOnly />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141416]/60 border border-[#27272A]/60">
            <div>
              <p className="text-xs font-medium text-[#71717A]">Active Toggle</p>
              <p className="text-[11px] text-[#52525B]">Enable or pause this sponsor slot</p>
            </div>
            <div className="flex items-center gap-1.5 text-[#3F3F46]">
              <ToggleLeft className="w-6 h-6" /><span className="text-[11px]">Off</span>
            </div>
          </div>
          <button disabled className="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#27272A] text-[#52525B] cursor-not-allowed">
            Save Sponsor — Disabled
          </button>
        </div>
      </div>

      <p className="text-[11px] text-[#52525B] mt-3 text-center">
        Interested in sponsoring?{" "}
        <a href="mailto:sponsor@cropitgif.vercel.app" className="text-[#F59E0B]/70 hover:text-[#F59E0B] transition-colors underline underline-offset-2">
          sponsor@cropitgif.vercel.app
        </a>
      </p>
    </div>
  );
}

