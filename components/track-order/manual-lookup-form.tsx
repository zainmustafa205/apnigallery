"use client";

import { useState } from "react";
import OrderSummaryCard, { OrderCardData } from "./order-summary-card";

export default function ManualLookupForm() {
  const [trackingCode, setTrackingCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderCardData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        trackingCode: trackingCode.trim(),
        phone: phone.trim(),
      });
      const res = await fetch(`/api/orders/track?${params.toString()}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(
          json.error ??
            "Order nahi mila. Tracking Code aur Phone Number dobara check karein."
        );
        return;
      }

      const data = json.data;
      setResult({
        id: data.id,
        orderNumber: data.orderNumber,
        trackingCode: data.trackingCode,
        phone: data.phone,
        status: data.status,
        paymentMethod: data.paymentMethod,
        totalAmount: Number(data.totalAmount),
        advanceAmount: Number(data.advanceAmount),
        remainingAmount: Number(data.remainingAmount),
        createdAt: data.createdAt,
        items: data.items.map((item: any) => ({
          productName: item.productName,
          variantLabel: [item.variant?.size, item.variant?.color, item.variant?.material]
            .filter(Boolean)
            .join(" / "),
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
        })),
        latestPayment: data.latestPayment
          ? {
              status: data.latestPayment.status,
              type: data.latestPayment.type,
              amount: Number(data.latestPayment.amount),
              submittedAt: data.latestPayment.submittedAt,
            }
          : null,
      });
    } catch {
      setError("Kuch masla ho gaya. Dobara koshish karein.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Tracking Code (TRK-XXXXXXXXXX)"
          value={trackingCode}
          onChange={(e) => setTrackingCode(e.target.value)}
          required
          className="border-primary-light/40 focus:ring-primary focus:border-primary flex-1 rounded-md border-2 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="border-primary-light/40 focus:ring-primary focus:border-primary flex-1 rounded-md border-2 px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary rounded-md px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Searching..." : "Track Order"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <OrderSummaryCard order={result} />}
    </div>
  );
}
