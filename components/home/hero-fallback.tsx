import Link from "next/link";
import { Coffee, Shirt, Frame, Gift, ShoppingBag, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

export function HeroFallback() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[var(--color-hero-bg)] via-[var(--color-lavender)] to-[var(--color-hero-bg)]">
      {/* Blur glow shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--color-accent)]/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-[var(--color-primary)]/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      {/* Dotted pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        {/* Left: text */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-[var(--color-primary)] shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-[var(--color-accent)]" />
            پاکستان بھر میں فری ڈیلیوری
          </span>

          <h1 className="mt-5 [animation:gradient-shift_4s_ease_infinite] bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-[length:200%_auto] bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
            ApniGallery
          </h1>

          <p
            dir="rtl"
            className="mx-auto mt-4 max-w-md text-lg text-[var(--color-text-dark)]/80 lg:mx-0"
          >
            آپ کی یادیں، ہماری پرنٹنگ — اپنی تصویر اپلوڈ کریں اور بہترین کوالٹی پرنٹنگ کے
            ساتھ گھر منگوائیں
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link
              href="/shop"
              className="rounded-full bg-[var(--color-accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-[var(--color-accent)]/30 shadow-lg transition-transform hover:scale-105 hover:bg-[var(--color-accent-hover)]"
            >
              ابھی آرڈر کریں
            </Link>
            <Link
              href="/customize"
              className="rounded-full border-2 border-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              اپنی تصویر اپلوڈ کریں
            </Link>
          </div>
        </div>

        {/* Right: floating product-icon composition (desktop/tablet only) */}
        <div className="relative mx-auto hidden h-80 w-80 sm:block lg:h-96 lg:w-96">
          <FloatingIcon
            icon={Coffee}
            className="top-6 left-2"
            delay="0s"
            size={64}
            bg="bg-white"
          />
          <FloatingIcon
            icon={Shirt}
            className="top-0 right-4"
            delay="0.6s"
            size={56}
            bg="bg-[var(--color-lavender)]"
          />
          <FloatingIcon
            icon={Frame}
            className="bottom-10 left-0"
            delay="1.1s"
            size={58}
            bg="bg-[var(--color-lavender)]"
          />
          <FloatingIcon
            icon={Gift}
            className="right-2 bottom-2"
            delay="1.6s"
            size={60}
            bg="bg-white"
          />
          <FloatingIcon
            icon={ShoppingBag}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            delay="0.3s"
            size={80}
            bg="bg-[var(--color-accent)]"
            iconColor="text-white"
          />
        </div>
      </div>
    </div>
  );
}

function FloatingIcon({
  icon: Icon,
  className,
  delay,
  size,
  bg,
  iconColor = "text-[var(--color-primary)]",
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  className: string;
  delay: string;
  size: number;
  bg: string;
  iconColor?: string;
}) {
  return (
    <div
      className={`absolute flex [animation:float-slow_5s_ease-in-out_infinite] items-center justify-center rounded-2xl shadow-xl ${bg} ${className}`}
      style={{ width: size, height: size, animationDelay: delay }}
    >
      <Icon size={size * 0.45} className={iconColor} />
    </div>
  );
}
