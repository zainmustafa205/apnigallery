"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { FloatingInput, FloatingTextarea } from "@/components/checkout/floating-field";
import { submitContactMessage } from "@/lib/actions/contact.actions";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitContactMessage({ name, email, phone, message });
      if (result.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="border-lavender bg-surface-alt flex flex-col items-center gap-3 rounded-xl border p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
        <p className="text-text-dark font-medium">Message bhej diya gaya!</p>
        <p className="text-text-dark/70 text-sm">Hum jald hi aapse rabta karenge.</p>
        <button
          onClick={() => setSuccess(false)}
          className="text-primary mt-2 text-sm hover:underline"
        >
          Naya message bhejein
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FloatingInput label="Pura Naam" value={name} onChange={setName} required />
      <FloatingInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      <FloatingInput
        label="Phone Number (optional)"
        type="tel"
        value={phone}
        onChange={setPhone}
      />
      <FloatingTextarea
        label="Message"
        value={message}
        onChange={setMessage}
        required
        rows={5}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-primary hover:bg-primary-light w-full rounded-lg px-5 py-3 text-sm font-medium text-white transition-colors disabled:opacity-60"
      >
        {isPending ? "Bheja ja raha hai..." : "Message Bhejein"}
      </button>
    </form>
  );
}
