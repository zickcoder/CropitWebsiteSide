"use client";
import React, { useEffect, useState } from "react";
import { Crop, Lock, Download, ArrowRight, ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react";

const steps = [
  {
    num: "1",
    icon: <Crop className="w-4 h-4 text-[#F59E0B]" />,
    label: "Crop Area",
    description: "Draw a selection over any part of your tab",
  },
  {
    num: "2",
    icon: <Lock className="w-4 h-4 text-[#F59E0B]" />,
    label: "Lock & Record",
    description: "Lock frame, hit record — captures locally at 60fps",
  },
  {
    num: "3",
    icon: <Download className="w-4 h-4 text-[#F59E0B]" />,
    label: "Trim & Save .gif",
    description: "Trim the clip, then save a lightweight GIF instantly",
  },
];

export function StepStrip() {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!zoomOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)));
      if (e.key === "-") setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));
      if (e.key === "0") setScale(1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [zoomOpen]);

  const openLightbox = () => {
    setScale(1);
    setZoomOpen(true);
  };

  return (
    <>
      <div className="w-full px-4 mb-5">
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-4">
          <p className="text-[11px] font-semibold text-[#71717A] uppercase tracking-widest mb-3 text-center">
            How it works
          </p>
          <div className="flex items-stretch gap-0">
            {steps.map((step, i) => (
              <React.Fragment key={step.num}>
                <div className="flex-1 flex flex-col items-center text-center px-2">
                  {/* Step icon badge */}
                  <div className="w-8 h-8 rounded-full bg-[#141416] border border-[#27272A] flex items-center justify-center mb-2 relative">
                    {step.icon}
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#F59E0B] text-[#141416] text-[8px] font-black flex items-center justify-center leading-none">
                      {step.num}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#FAFAFA] mb-0.5">{step.label}</p>
                  <p className="text-[10px] text-[#71717A] leading-relaxed hidden sm:block">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex items-center px-1 text-[#3F3F46] mt-3 self-start">
                    <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Clickable & Zoomable How It Works Image */}
          <button
            type="button"
            onClick={openLightbox}
            className="group relative mt-4 w-full rounded-lg overflow-hidden border border-[#27272A] hover:border-[#F59E0B]/50 bg-[#141416] cursor-pointer transition-all block text-left"
            aria-label="Click to zoom How cropitGIF works image"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/how-it-works.jpg"
              alt="How cropitGIF works"
              className="w-full h-auto object-cover block group-hover:opacity-95 transition-opacity"
            />
            <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#141416]/85 text-[#FAFAFA] border border-[#27272A] group-hover:border-[#F59E0B]/50 group-hover:text-[#F59E0B] transition-all">
              <ZoomIn className="w-3 h-3" />
              Click to zoom
            </span>
          </button>
        </div>
      </div>

      {/* ── Zoomable Lightbox Modal ─────────────────────────────── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-soft animate-fade-in"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed How it works image"
        >
          {/* Top Zoom Controls Bar */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#27272A] bg-[#141416]/90"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-semibold text-[#FAFAFA]">
              How it works <span className="text-[#71717A] font-mono ml-1.5">{Math.round(scale * 100)}%</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale((s) => Math.min(3, +(s + 0.25).toFixed(2)))}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale(1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                aria-label="Reset zoom"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-5 bg-[#27272A] mx-1" />
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Zoom Canvas */}
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8"
            onWheel={(e) => {
              if (e.ctrlKey || Math.abs(e.deltaY) > 0) {
                setScale((s) => {
                  const delta = e.deltaY < 0 ? 0.15 : -0.15;
                  return Math.min(3, Math.max(0.5, +(s + delta).toFixed(2)));
                });
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/how-it-works.jpg"
              alt="How cropitGIF works zoomed"
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => (s === 1 ? 1.75 : 1));
              }}
              style={{ transform: `scale(${scale})` }}
              className={`max-w-full max-h-[82vh] rounded-xl border border-[#27272A] shadow-2xl transition-transform duration-150 select-none ${
                scale > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}
