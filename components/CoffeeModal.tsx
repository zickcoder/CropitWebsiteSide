"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Coffee, Loader2, EyeOff } from "lucide-react";

type QrProviderKey = "gcash" | "maya" | "qrph";

interface QrProviderConfig {
  url: string | null;
  visible: boolean;
}

type QrProvidersState = Record<QrProviderKey, QrProviderConfig>;

const PROVIDER_META: { key: QrProviderKey; label: string }[] = [
  { key: "gcash", label: "GCash" },
  { key: "maya", label: "Maya" },
  { key: "qrph", label: "QR Ph" },
];

interface CoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoffeeModal({ isOpen, onClose }: CoffeeModalProps) {
  const [providers, setProviders] = useState<QrProvidersState>({
    gcash: { url: null, visible: true },
    maya: { url: null, visible: true },
    qrph: { url: null, visible: true },
  });
  const [activeKey, setActiveKey] = useState<QrProviderKey>("gcash");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setQrLoading(true);
    setQrError(false);

    fetch("/api/settings/qr", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d.providers) {
          setProviders(d.providers);
          const firstVisible = PROVIDER_META.find(
            (m) => d.providers[m.key]?.visible
          );
          if (firstVisible) {
            setActiveKey(firstVisible.key);
          }
        }
      })
      .catch(() => {})
      .finally(() => setQrLoading(false));
  }, [isOpen]);

  const visibleProviders = PROVIDER_META.filter(
    (m) => providers[m.key]?.visible
  );

  const currentProvider = providers[activeKey];
  const imageSrc = currentProvider?.url ?? "/gcash-qr.png";

  return (
    <Modal isOpen={isOpen} onClose={onClose} widthClass="max-w-xs">
      <div className="flex flex-col items-center text-center gap-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
            <Coffee className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Buy me a coffee ☕</h3>
          <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-[210px]">
            Scan with GCash, Maya, or any QR Ph app to buy the developer a coffee
          </p>
        </div>

        {/* Provider Switcher Tabs (only shown if >1 visible) */}
        {!qrLoading && visibleProviders.length > 1 && (
          <div className="flex items-center gap-1 p-1 rounded-full bg-[#141416] border border-[#27272A]">
            {visibleProviders.map((p) => {
              const active = activeKey === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => {
                    setActiveKey(p.key);
                    setQrError(false);
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    active
                      ? "bg-[#F59E0B] text-[#141416]"
                      : "text-[#71717A] hover:text-[#FAFAFA]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        )}

        {/* QR Image */}
        <div className="relative w-48 h-48 rounded-xl border border-[#27272A] bg-[#141416] flex items-center justify-center overflow-hidden flex-shrink-0">
          {qrLoading ? (
            <Loader2 className="w-6 h-6 text-[#71717A] animate-spin" />
          ) : visibleProviders.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4">
              <EyeOff className="w-6 h-6 text-[#3F3F46]" />
              <p className="text-[11px] text-[#71717A] leading-relaxed">
                QR codes are currently hidden.
              </p>
            </div>
          ) : qrError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/gcash-qr.svg"
              alt="QR placeholder"
              width={160}
              height={160}
              className="object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={`${activeKey} QR Code`}
              width={192}
              height={192}
              className="object-contain w-full h-full rounded-xl"
              onError={() => setQrError(true)}
            />
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl text-xs font-medium bg-[#141416] border border-[#27272A] text-[#A1A1AA] hover:bg-[#222227] hover:border-[#3F3F46] hover:text-[#FAFAFA] transition-all"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
