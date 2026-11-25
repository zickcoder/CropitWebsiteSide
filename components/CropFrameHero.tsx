"use client";
import React, { useState } from "react";
import { Crop, Play, Square, Check, RefreshCw } from "lucide-react";

export function CropFrameHero() {
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const toggleRecording = () => {
    if (!isRecording && !recorded) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setRecorded(true);
      }, 3200);
    } else if (recorded) {
      setRecorded(false);
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full px-4 mb-5">
      {/* Browser mockup frame */}
      <div className="w-full bg-[#1C1C20] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
        {/* Browser Top Bar */}
        <div className="h-8 bg-[#18181B] border-b border-[#27272A] px-3 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27272A]" />
          </div>

          <div className="text-[10px] text-[#71717A] font-mono">100% Local</div>
        </div>

        {/* Tab Canvas Area with Crop Overlay */}
        <div className="relative h-48 bg-[#141416] flex items-center justify-center p-4 overflow-hidden">
          {/* Subtle background grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#FAFAFA 1px, transparent 1px), linear-gradient(90deg, #FAFAFA 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Interactive Crop Frame Graphic */}
          <div className="relative w-full max-w-[340px] h-32 rounded-lg border border-[#F59E0B] bg-[#1C1C20]/60 p-2.5 flex flex-col justify-between transition-all">
            {/* 4 Corner Crop Markers */}
            <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#F59E0B]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#F59E0B]" />
            <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#F59E0B]" />
            <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#F59E0B]" />

            {/* Frame Top Info */}
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-[#FAFAFA] bg-[#141416]/80 px-1.5 py-0.5 rounded border border-[#27272A]">
                480 × 260 px
              </span>

              {isRecording ? (
                <span className="inline-flex items-center gap-1 font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded border border-[#F59E0B]/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  REC 00:03.2
                </span>
              ) : recorded ? (
                <span className="inline-flex items-center gap-1 font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/30">
                  <Check className="w-3 h-3 text-[#10B981]" />
                  Ready (214 KB)
                </span>
              ) : (
                <span className="font-mono text-[#71717A] text-[10px]">
                  Press to preview
                </span>
              )}
            </div>

            {/* Frame Center Micro-Interaction */}
            <div className="flex flex-col items-center justify-center my-auto">
              <button
                type="button"
                onClick={toggleRecording}
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#141416] border border-[#27272A] hover:border-[#F59E0B]/50 hover:bg-[#1C1C20] text-[#FAFAFA] transition-all"
              >
                {isRecording ? (
                  <>
                    <Square className="w-3 h-3 text-[#EF4444] fill-current" />
                    <span>Recording crop area...</span>
                  </>
                ) : recorded ? (
                  <>
                    <RefreshCw className="w-3 h-3 text-[#F59E0B]" />
                    <span>GIF saved locally! Click to reset</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#F59E0B] fill-current" />
                    <span>Simulate Crop & Record</span>
                  </>
                )}
              </button>
            </div>

            {/* Frame Bottom Local privacy tag */}
            <div className="flex items-center justify-between text-[10px] text-[#71717A]">
              <span className="flex items-center gap-1 font-mono">
                <Crop className="w-3 h-3 text-[#F59E0B]" />
                Zero server upload
              </span>
              <span className="font-mono">Local Canvas API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
