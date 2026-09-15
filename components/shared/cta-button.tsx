// components/shared/cta-button.tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onTouchStart={() => {}}
      className="group/button from-primary to-primary-light focus-visible:ring-accent/60 relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0.5 active:scale-[0.96] active:shadow-sm"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />
      <span className="relative">{children}</span>
      <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-1 group-active/button:translate-x-0.5" />
    </Link>
  );
}
