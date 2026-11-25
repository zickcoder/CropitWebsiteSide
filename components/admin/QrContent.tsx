"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImageOff,
  Eye,
  EyeOff,
} from "lucide-react";

type QrProviderKey = "gcash" | "maya" | "qrph";

interface QrProviderConfig {
  url: string | null;
  visible: boolean;
}

type QrProvidersState = Record<QrProviderKey, QrProviderConfig>;

const PROVIDERS: { key: QrProviderKey; label: string }[] = [
  { key: "gcash", label: "GCash" },
  { key: "maya", label: "Maya" },
  { key: "qrph", label: "QR Ph" },
];

type ToastType = "success" | "error";

function Toast({
  message,
  type,
  onDone,
}: {
  message: string;
  type: ToastType;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium shadow-lg animate-scale-up ${
        type === "success"
          ? "bg-[#1C1C20] border-[#10B981]/30 text-[#10B981]"
          : "bg-[#1C1C20] border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}

export function QrContent() {
  const [activeTab, setActiveTab] = useState<QrProviderKey>("gcash");
  const [providers, setProviders] = useState<QrProvidersState>({
    gcash: { url: null, visible: true },
    maya: { url: null, visible: true },
    qrph: { url: null, visible: true },
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/qr")
      .then((r) => r.json())
      .then((d) => {
        if (d.providers) setProviders(d.providers);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const switchTab = (tab: QrProviderKey) => {
    setActiveTab(tab);
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  const handleFile = (file: File) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setToast({ message: "Only PNG, JPG, WEBP or GIF allowed.", type: "error" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ message: "File must be under 2 MB.", type: "error" });
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const handleSave = async () => {
    if (!selectedFile) return;
    setSaving(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("provider", activeTab);
    try {
      const res = await fetch("/api/admin/qr", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToast({ message: data.error || "Upload failed.", type: "error" });
      } else {
        if (data.providers) setProviders(data.providers);
        setPreviewUrl(null);
        setSelectedFile(null);
        const label = PROVIDERS.find((p) => p.key === activeTab)?.label;
        setToast({ message: `✓ ${label} QR Code updated!`, type: "success" });
      }
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    const current = providers[activeTab];
    const nextVisible = !current.visible;
    setToggling(true);
    try {
      const res = await fetch("/api/admin/qr", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: activeTab, visible: nextVisible }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setToast({ message: data.error || "Failed to update visibility.", type: "error" });
      } else {
        if (data.providers) setProviders(data.providers);
        const label = PROVIDERS.find((p) => p.key === activeTab)?.label;
        setToast({
          message: nextVisible
            ? `✓ ${label} is now visible on website`
            : `${label} hidden from website`,
          type: "success",
        });
      }
    } catch {
      setToast({ message: "Network error.", type: "error" });
    } finally {
      setToggling(false);
    }
  };

  const activeConfig = providers[activeTab];
  const displayUrl = previewUrl ?? activeConfig.url;
  const activeLabel = PROVIDERS.find((p) => p.key === activeTab)?.label ?? "";

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <h1 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2">
          <QrCode className="w-4 h-4 text-[#F59E0B]" />
          QR Code Image
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Manage QR images for GCash, Maya, and QR Ph, and choose which ones appear on the main website.
        </p>
      </div>

      {/* ── Provider Tabs (GCash / Maya / QR Ph) ────────────────── */}
      <div className="flex items-center gap-1.5 p-1 bg-[#1C1C20] border border-[#27272A] rounded-xl mb-4">
        {PROVIDERS.map((p) => {
          const isActive = activeTab === p.key;
          const isVisible = providers[p.key].visible;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => switchTab(p.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#141416] text-[#FAFAFA] border border-[#27272A]"
                  : "text-[#71717A] hover:text-[#A1A1AA]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isVisible ? "bg-[#10B981]" : "bg-[#3F3F46]"
                }`}
              />
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {/* ── Show / Hide Toggle Card ───────────────────────────── */}
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#FAFAFA]">
              {activeLabel} Visibility on Website
            </p>
            <p className="text-[11px] text-[#71717A] mt-0.5">
              {activeConfig.visible
                ? "Visitors can see and scan this QR code."
                : "Hidden from the public Coffee QR modal."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={toggling || loading}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all disabled:opacity-50 ${
              activeConfig.visible
                ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 hover:bg-[#10B981]/20"
                : "bg-[#141416] text-[#A1A1AA] border-[#27272A] hover:text-[#FAFAFA] hover:border-[#3F3F46]"
            }`}
          >
            {toggling ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : activeConfig.visible ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                Shown
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                Hidden
              </>
            )}
          </button>
        </div>

        {/* ── Current / Preview ─────────────────────────────────── */}
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-5">
          <p className="text-xs font-medium text-[#A1A1AA] mb-3">
            {previewUrl ? (
              <>
                {activeLabel} Preview (unsaved){" "}
                <span className="text-[#F59E0B] text-[11px]">— save to publish</span>
              </>
            ) : (
              `Current ${activeLabel} QR Code`
            )}
          </p>
          <div className="flex items-center justify-center">
            {loading ? (
              <div className="w-48 h-48 rounded-xl bg-[#141416] border border-[#27272A] flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#71717A] animate-spin" />
              </div>
            ) : displayUrl ? (
              <div
                className={`relative rounded-xl overflow-hidden border ${
                  previewUrl ? "border-[#F59E0B]/40" : "border-[#27272A]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayUrl}
                  alt={`${activeLabel} QR Code`}
                  className="w-48 h-48 object-contain bg-[#141416]"
                />
                {previewUrl && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#F59E0B] text-[#141416] text-[9px] font-bold rounded uppercase tracking-widest">
                    Preview
                  </div>
                )}
              </div>
            ) : (
              <div className="w-48 h-48 rounded-xl bg-[#141416] border border-dashed border-[#27272A] flex flex-col items-center justify-center gap-2">
                <ImageOff className="w-8 h-8 text-[#3F3F46]" />
                <p className="text-[11px] text-[#52525B] text-center leading-relaxed px-3">
                  No {activeLabel} QR uploaded yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Upload Zone ───────────────────────────────────────── */}
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-5">
          <p className="text-xs font-medium text-[#A1A1AA] mb-3">
            Upload New {activeLabel} QR Image
          </p>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all ${
              dragging
                ? "border-[#F59E0B] bg-[#F59E0B]/5"
                : "border-[#27272A] hover:border-[#3F3F46] hover:bg-[#141416]/60"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#141416] border border-[#27272A] flex items-center justify-center">
              <Upload className="w-5 h-5 text-[#71717A]" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-[#FAFAFA]">
                {selectedFile ? selectedFile.name : "Drop image here, or click to browse"}
              </p>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                PNG, JPG, WEBP · max 2 MB
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedFile || saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-[#F59E0B] text-[#141416] hover:bg-[#FBBF24] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              `Save ${activeLabel} QR Code`
            )}
          </button>
          {selectedFile && (
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-[#141416] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </div>
  );
}
