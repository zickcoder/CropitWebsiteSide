"use client";
import React, { useState, useRef } from "react";
import { Modal } from "./Modal";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";

type FormState = "idle" | "sending_otp" | "otp_sent" | "submitting" | "success";

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InputLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">{children}</label>
  );
}

const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput(props, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={`w-full bg-[#141416] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B]/60 transition-all disabled:opacity-50 ${props.className ?? ""}`}
      />
    );
  }
);

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 mt-1 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
      <span>{msg}</span>
    </div>
  );
}

export function SuggestModal({ isOpen, onClose }: SuggestModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [token, setToken] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setName("");
    setEmail("");
    setOtp("");
    setSuggestion("");
    setToken("");
    setFormState("idle");
    setErrorMsg("");
    setDevCode(null);
  };

  const handleClose = () => {
    if (formState !== "sending_otp" && formState !== "submitting") {
      reset();
      onClose();
    }
  };

  const handleRequestOtp = async () => {
    setErrorMsg("");
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!suggestion.trim() || suggestion.trim().length < 5) {
      setErrorMsg("Please write a suggestion (at least 5 characters).");
      return;
    }

    setFormState("sending_otp");
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to send OTP. Please try again.");
        setFormState("idle");
        return;
      }
      setToken(data.token || "");
      setFormState("otp_sent");
      setDevCode(data.devCode ?? null);
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setFormState("idle");
    }
  };

  const handleVerifyAndSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Step 1: clicking "Submit Suggestion" sends the OTP first
    if (formState === "idle") {
      await handleRequestOtp();
      return;
    }

    if (formState !== "otp_sent") return;

    // Step 2: verify OTP and send submission
    setFormState("submitting");
    try {
      const res = await fetch("/api/submit-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, otp, token, suggestion }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Invalid OTP. Please try again.");
        setFormState("otp_sent");
        return;
      }
      setFormState("success");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setFormState("otp_sent");
    }
  };

  const isSendingOtp = formState === "sending_otp";
  const isSubmitting = formState === "submitting";
  const otpStep = formState === "otp_sent" || isSubmitting;

  const isFormIncomplete = !name.trim() || !email.trim() || suggestion.trim().length < 5;
  const isOtpIncomplete = otp.trim().length !== 6;

  if (formState === "success") {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} widthClass="max-w-sm">
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-12 h-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FAFAFA] mb-1">
              Suggestion Sent Thanks For Supporting
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-full py-2 rounded-xl text-xs font-semibold bg-[#F59E0B] text-[#141416] hover:bg-[#FBBF24] active:scale-[0.98] transition-all"
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="💡 Suggest a Feature" widthClass="max-w-sm">
      <form onSubmit={handleVerifyAndSend} className="flex flex-col gap-4">
        {devCode && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30">
            <span className="text-[10px] font-semibold text-[#F59E0B] uppercase tracking-widest">Dev Mode</span>
            <span className="text-[10px] text-[#A1A1AA]">EmailJS not set — OTP:</span>
            <span className="font-mono text-sm font-bold text-[#F59E0B] ml-auto tracking-widest">{devCode}</span>
          </div>
        )}

        <div>
          <InputLabel>Your Name</InputLabel>
          <TextInput
            type="text"
            placeholder="e.g. Alex"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSendingOtp || otpStep}
            required
            autoFocus
          />
        </div>

        <div>
          <InputLabel>Email Address</InputLabel>
          <TextInput
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSendingOtp || otpStep}
            required
          />
        </div>

        <div>
          <InputLabel>Your Idea</InputLabel>
          <textarea
            placeholder="e.g. Add a countdown timer before recording starts..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            disabled={isSendingOtp || otpStep}
            required
            rows={3}
            className="w-full bg-[#141416] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/50 focus:border-[#F59E0B]/60 transition-all disabled:opacity-50 resize-none leading-relaxed"
          />
        </div>

        {otpStep && (
          <div className="pt-1 border-t border-[#27272A]">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-[#A1A1AA]">
                6-Digit OTP Code
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormState("idle");
                  setOtp("");
                  setErrorMsg("");
                }}
                disabled={isSubmitting}
                className="text-[11px] text-[#71717A] hover:text-[#F59E0B] transition-colors"
              >
                Edit details
              </button>
            </div>
            <TextInput
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={isSubmitting}
              className="font-mono text-center tracking-[0.4em] text-base"
            />
            <p className="text-[11px] text-[#A1A1AA] mt-1.5 leading-relaxed">
              We sent a 6-digit code to <span className="text-[#F59E0B]">{email}</span>. Enter it above and click Send Submission.
            </p>
          </div>
        )}

        {errorMsg && <ErrorMsg msg={errorMsg} />}

        <button
          type="submit"
          disabled={
            isSendingOtp ||
            isSubmitting ||
            (!otpStep && isFormIncomplete) ||
            (otpStep && isOtpIncomplete)
          }
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-[#F59E0B] text-[#141416] hover:bg-[#FBBF24] active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSendingOtp ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending OTP...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending Submission...
            </>
          ) : otpStep ? (
            <>
              <Send className="w-4 h-4" />
              Send Submission
            </>
          ) : (
            "Submit Suggestion"
          )}
        </button>
      </form>
    </Modal>
  );
}
