"use client";
import React, { useState } from "react";
import { Modal } from "./Modal";
import { Shield } from "lucide-react";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <footer className="w-full px-4 py-6 mt-auto flex flex-col items-center gap-3 border-t border-[#1C1C20]">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {/* Logo mark */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#FAFAFA]">cropitGIF</span>
            <span className="text-[10px] font-medium text-[#141416] bg-[#F59E0B] px-1 py-px rounded text-[9px]">GIF</span>
          </div>
          <span className="text-[#3F3F46] text-xs">•</span>
          <span className="text-xs text-[#52525B]">100% Local &amp; Private</span>
          <span className="text-[#3F3F46] text-xs">•</span>
          <button
            onClick={() => setPrivacyOpen(true)}
            className="text-xs text-[#71717A] hover:text-[#F59E0B] transition-colors inline-flex items-center gap-1"
          >
            <Shield className="w-3 h-3" />
            Privacy Policy
          </button>
        </div>
        <p className="text-[10px] text-[#3F3F46] text-center">
          Made with care by a student developer · {new Date().getFullYear()}
        </p>
      </footer>

      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="🔒 Privacy Policy"
        widthClass="max-w-sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#141416] border border-[#27272A]">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#FAFAFA] mb-0.5">Zero Data Collection</p>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                cropitGIF processes all screen captures entirely on your local device.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs text-[#A1A1AA] leading-relaxed">
            <div className="flex gap-2">
              <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>
              <p>All screen recording and GIF encoding happens <strong className="text-[#FAFAFA]">entirely in your browser</strong>, never uploaded to any server.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>
              <p>cropitGIF <strong className="text-[#FAFAFA]">collects zero browsing data</strong>, tab content, history, URLs, or personal information.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>
              <p>Saved GIFs are written directly to your device's Downloads folder — only you can access them.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#10B981] flex-shrink-0 font-bold">✓</span>
              <p>The <strong className="text-[#FAFAFA]">feature suggestion form</strong> on this website optionally collects your name and email (solely to verify suggestions and prevent spam). This data is never sold or shared.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[#71717A] flex-shrink-0 font-bold">→</span>
              <p>Questions? Email <a href="mailto:thacoj@gmail.com" className="text-[#F59E0B] hover:underline">thacoj@gmail.com</a></p>
            </div>
          </div>

          <button
            onClick={() => setPrivacyOpen(false)}
            className="w-full py-2 rounded-xl text-xs font-medium bg-[#141416] border border-[#27272A] text-[#A1A1AA] hover:bg-[#222227] hover:border-[#3F3F46] hover:text-[#FAFAFA] transition-all"
          >
            Got it
          </button>
        </div>
      </Modal>
    </>
  );
}

