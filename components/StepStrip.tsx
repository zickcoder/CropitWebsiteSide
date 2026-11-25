"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef<number>(1);

  const clampScale = (val: number) => Math.min(3, Math.max(1, +val.toFixed(2)));

  useEffect(() => {
    if (!zoomOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
      if (e.key === "+" || e.key === "=") setScale((s) => clampScale(s + 0.25));
      if (e.key === "-") setScale((s) => clampScale(s - 0.25));
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

  const handleTapImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((s) => {
      if (s < 1.75) return 1.75;
      if (s < 2.5) return 2.5;
      return 1;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.hypot(dx, dy);
      pinchStartScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchStartDist.current;
      setScale(clampScale(pinchStartScale.current * ratio));
    }
  };

  const handleTouchEnd = () => {
    pinchStartDist.current = null;
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
            <span className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-[#141416]/85 text-[#FAFAFA] border border-[#27272A] group-hover:border-[#F59E0B]/50 group-hover:text-[#F59E0B] transition-all">
              <ZoomIn className="w-3 h-3" />
              Click to zoom
            </span>
          </button>
        </div>
      </div>

      {/* ── Zoomable Lightbox Modal ─────────────────────────────── */}
      {zoomOpen && (
        <div
          className="fixed inset-0 h-[100dvh] z-50 flex flex-col bg-black/85 backdrop-blur-soft animate-fade-in"
          onClick={() => setZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed How it works image"
        >
          {/* Top Zoom Controls Bar */}
          <div
            className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#27272A] bg-[#141416]/95 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-semibold text-[#FAFAFA]">
              How it works <span className="text-[#F59E0B] font-mono ml-1.5">{Math.round(scale * 100)}%</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setScale((s) => clampScale(s - 0.25))}
                disabled={scale <= 1}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale((s) => clampScale(s + 0.25))}
                disabled={scale >= 3}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setScale(1)}
                disabled={scale === 1}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Reset zoom"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-5 bg-[#27272A] mx-0.5 sm:mx-1" />
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable / Pannable Zoom Canvas */}
          <div
            className="flex-1 overflow-auto flex p-3 sm:p-6 touch-pan-x touch-pan-y"
            onWheel={(e) => {
              if (Math.abs(e.deltaY) > 0) {
                setScale((s) => clampScale(s + (e.deltaY < 0 ? 0.2 : -0.2)));
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/how-it-works.jpg"
              alt="How cropitGIF works zoomed"
              onClick={handleTapImage}
              style={
                scale === 1
                  ? undefined
                  : {
                      width: `${scale * 100}%`,
                      maxWidth: "none",
                      height: "auto",
                    }
              }
              className={`m-auto rounded-xl border border-[#27272A] shadow-2xl transition-all duration-150 select-none ${
                scale === 1
                  ? "max-w-full max-h-[78dvh] w-auto h-auto object-contain cursor-zoom-in"
                  : scale < 2.5
                    ? "cursor-zoom-in"
                    : "cursor-zoom-out"
              }`}
            />
          </div>

          {/* Subtle Hint */}
          <div
            className="px-4 py-2 text-center text-[11px] text-[#71717A] bg-[#141416]/90 border-t border-[#27272A] flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            Tap image or use + to zoom in · Drag or scroll to pan
          </div>
        </div>
      )}
    </>
  );
}
