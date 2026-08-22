"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923001234567";
const DEFAULT_MESSAGE = "Hi, mujhe ApniGallery se order ke baare mein puchna hai.";

export function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <MessageCircle
        size={26}
        className="relative text-white"
        fill="white"
        strokeWidth={0}
      />
      <span className="pointer-events-none absolute right-full mr-3 hidden rounded-md bg-[var(--color-text-dark)] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        Chat with us
      </span>
    </a>
  );
}
