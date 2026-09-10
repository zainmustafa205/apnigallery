"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitPaymentScreenshot } from "@/lib/actions/payment.actions";
import type { PaymentMethod } from "@/lib/generated/prisma/client";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function PaymentUploadForm({
  orderId,
  trackingCode,
  defaultMethod,
}: {
  orderId: string;
  trackingCode: string;
  defaultMethod: PaymentMethod;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setError(null);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setError("Only JPG, PNG, or WEBP images are allowed.");
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("Screenshot must be under 5MB.");
      setFile(null);
      return;
    }

    setFile(selected);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a screenshot to upload.");
      return;
    }

    startTransition(async () => {
      const result = await submitPaymentScreenshot(orderId, trackingCode, method, file);

      if (!result.success) {
        setError(result.error ?? "Upload failed. Please try again.");
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        Screenshot submitted! We&apos;ll verify it and confirm your order soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value as PaymentMethod)}
        style={{ colorScheme: "light" }}
        className="border-lavender bg-surface focus:ring-primary-light rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      >
        <option value="JAZZCASH">JazzCash</option>
        <option value="EASYPAISA">Easypaisa</option>
        <option value="BANK_TRANSFER">Bank Transfer</option>
      </select>

      <label className="border-primary-light/60 hover:border-primary hover:bg-lavender/30 flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed px-3 py-3 text-sm transition-all active:scale-[0.98]">
        <Upload className="text-primary h-4 w-4 shrink-0" />
        <span className="text-text-dark/70 truncate">
          {file ? file.name : "Choose payment screenshot..."}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !file}
        className="bg-primary hover:bg-primary-light rounded-xl px-6 py-2.5 font-medium text-white transition-all active:scale-95 disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Submit Screenshot"}
      </button>
    </form>
  );
}
