"use client";
import React, { useEffect, useState } from "react";
import {
  Lightbulb,
  Trash2,
  Loader2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Inbox,
  X,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";

interface Suggestion {
  id: string;
  name: string;
  email: string;
  suggestion: string;
  status: "New" | "Planned" | "Done";
  created_at: string;
}

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
    const t = setTimeout(onDone, 3000);
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

const STATUS_CFG = {
  New: {
    next: "Planned" as const,
    label: "New",
    cls: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
  },
  Planned: {
    next: "Done" as const,
    label: "Planned",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  Done: {
    next: "New" as const,
    label: "Done",
    cls: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
  },
};

export function SuggestionsContent() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Suggestion | null>(null);
  const [devMode, setDevMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null
  );

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/suggestions");
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setDevMode(!!data.devMode);
    } catch {
      setToast({ message: "Failed to load suggestions.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  const handleStatus = async (
    id: string,
    targetStatus: Suggestion["status"]
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (res.ok) {
        setSuggestions((p) =>
          p.map((s) => (s.id === id ? { ...s, status: targetStatus } : s))
        );
        setSelected((prev) =>
          prev && prev.id === id ? { ...prev, status: targetStatus } : prev
        );
      } else {
        setToast({ message: "Failed to update status.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error.", type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuggestions((p) => p.filter((s) => s.id !== id));
        if (selected?.id === id) setSelected(null);
        setToast({ message: "Deleted.", type: "success" });
      } else {
        setToast({ message: "Failed to delete.", type: "error" });
      }
    } catch {
      setToast({ message: "Network error.", type: "error" });
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold text-[#FAFAFA] flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
            Feature Suggestions
          </h1>
          <p className="text-xs text-[#71717A] mt-1">
            {suggestions.length} OTP-verified submission
            {suggestions.length !== 1 ? "s" : ""} · Click any item to view details
          </p>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1C1C20] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {devMode && (
        <div className="mb-4 px-3 py-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[11px] text-[#F59E0B]">
          <strong>Dev mode</strong> — in-memory only. Configure Supabase to
          persist data.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#71717A] animate-spin" />
        </div>
      ) : suggestions.length === 0 ? (
        <div className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-12 flex flex-col items-center gap-3">
          <Inbox className="w-8 h-8 text-[#3F3F46]" />
          <p className="text-sm text-[#71717A]">No suggestions yet.</p>
          <p className="text-xs text-[#52525B]">
            They&apos;ll appear here once users submit ideas.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {suggestions.map((s) => {
            const cfg = STATUS_CFG[s.status ?? "New"];
            return (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(s);
                  }
                }}
                className="bg-[#1C1C20] border border-[#27272A] rounded-xl p-4 hover:border-[#F59E0B]/40 hover:bg-[#222227]/60 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-xs font-semibold text-[#FAFAFA] group-hover:text-[#F59E0B] transition-colors truncate">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-[#71717A] font-mono truncate">
                      {s.email}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatus(s.id, cfg.next);
                    }}
                    disabled={updatingId === s.id}
                    title={`Click to change to "${cfg.next}"`}
                    className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all hover:opacity-80 disabled:opacity-50 ${cfg.cls}`}
                  >
                    {cfg.label}
                  </button>
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-3 line-clamp-2">
                  {s.suggestion}
                </p>

                <div
                  className="flex items-center justify-between gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1 text-[11px] text-[#52525B]">
                    <Clock className="w-3 h-3" />
                    {new Date(s.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {confirmId === s.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <span className="text-[11px] text-[#A1A1AA]">Sure?</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                      <span className="text-[#3F3F46]">·</span>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="text-[11px] text-[#71717A] hover:text-[#A1A1AA]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(s.id)}
                      disabled={deletingId === s.id}
                      className="inline-flex items-center gap-1 text-[11px] text-[#52525B] hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      {deletingId === s.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Suggestion Detail Modal (Name / Email / Suggestion Boxes) ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-soft animate-fade-in"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md bg-[#1C1C20] border border-[#27272A] rounded-2xl shadow-2xl animate-scale-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#27272A]">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-sm font-semibold text-[#FAFAFA]">
                  Suggestion Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Clean Name / Email / Suggestion Boxes */}
            <div className="p-5 space-y-3.5">
              {/* Name Box */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider mb-1.5">
                  <User className="w-3 h-3 text-[#F59E0B]" />
                  Name
                </label>
                <div className="w-full bg-[#141416] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-medium text-[#FAFAFA]">
                  {selected.name}
                </div>
              </div>

              {/* Email Box */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider mb-1.5">
                  <Mail className="w-3 h-3 text-[#F59E0B]" />
                  Email
                </label>
                <div className="w-full bg-[#141416] border border-[#27272A] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#A1A1AA] flex items-center justify-between gap-2">
                  <span className="truncate">{selected.email}</span>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-[11px] font-sans font-semibold text-[#F59E0B] hover:underline flex-shrink-0"
                  >
                    Reply
                  </a>
                </div>
              </div>

              {/* Suggestion Box */}
              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-[#71717A] uppercase tracking-wider mb-1.5">
                  <MessageSquare className="w-3 h-3 text-[#F59E0B]" />
                  Suggestion
                </label>
                <div className="w-full bg-[#141416] border border-[#27272A] rounded-xl px-3.5 py-3 text-sm text-[#FAFAFA] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selected.suggestion}
                </div>
              </div>

              {/* Status selector & Date */}
              <div className="flex items-center justify-between pt-2 border-t border-[#27272A]">
                <div className="flex items-center gap-1.5">
                  {(["New", "Planned", "Done"] as const).map((st) => {
                    const active = (selected.status ?? "New") === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        disabled={updatingId === selected.id}
                        onClick={() => handleStatus(selected.id, st)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                          active
                            ? STATUS_CFG[st].cls
                            : "bg-[#141416] text-[#71717A] border-[#27272A] hover:text-[#FAFAFA]"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-[#52525B] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(selected.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
