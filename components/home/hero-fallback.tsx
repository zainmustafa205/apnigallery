import Link from "next/link";
import {
  Coffee,
  Shirt,
  Frame,
  Gift,
  ShoppingBag,
  Upload,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Sparkles,
  Zap,
} from "lucide-react";
import type { ComponentType } from "react";

export function HeroFallback() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[var(--color-hero-bg)] via-[var(--color-lavender)] to-[var(--color-hero-bg)]">
      {/* Dotted pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Mobile-only: dim background floating icons (behind text) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.18] sm:hidden">
        <FloatingIcon
          icon={Coffee}
          className="top-[8%] left-[8%]"
          delay="0s"
          size={40}
          bg="bg-white"
        />
        <FloatingIcon
          icon={Shirt}
          className="top-[14%] right-[10%]"
          delay="0.6s"
          size={36}
          bg="bg-white"
        />
        <FloatingIcon
          icon={Frame}
          className="bottom-[22%] left-[6%]"
          delay="1.1s"
          size={38}
          bg="bg-white"
        />
        <FloatingIcon
          icon={Gift}
          className="right-[8%] bottom-[8%]"
          delay="1.6s"
          size={40}
          bg="bg-white"
        />
        {/* <FloatingIcon
          icon={ShoppingBag}
          className="top-[45%] left-[42%]"
          delay="0.3s"
          size={44}
          bg="bg-white"
        /> */}
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-6 py-6 sm:py-8 lg:grid-cols-2 lg:gap-10 lg:py-10">
        {/* Left: floating product-icon composition — sm and up only, full opacity */}
        <div className="relative mx-auto hidden h-64 w-64 sm:block lg:h-72 lg:w-72">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />

          <FloatingIcon
            icon={Coffee}
            className="top-2 left-0"
            delay="0s"
            size={54}
            bg="bg-white"
          />
          <FloatingIcon
            icon={Shirt}
            className="top-0 right-0"
            delay="0.6s"
            size={48}
            bg="bg-[var(--color-lavender)]"
          />
          <FloatingIcon
            icon={Frame}
            className="bottom-6 left-0"
            delay="1.1s"
            size={50}
            bg="bg-[var(--color-lavender)]"
          />
          <FloatingIcon
            icon={Gift}
            className="right-2 bottom-0"
            delay="1.6s"
            size={52}
            bg="bg-white"
          />
          <FloatingIcon
            icon={ShoppingBag}
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            delay="0.3s"
            size={70}
            bg="bg-[var(--color-accent)]"
            iconColor="text-white"
          />

          <span
            className="absolute bottom-1/3 left-4 h-3.5 w-3.5 [animation:float-slow_4s_ease-in-out_infinite] rounded-full bg-[var(--color-accent)]/60"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="absolute top-1/4 right-6 h-3 w-3 [animation:float-slow_5s_ease-in-out_infinite] rounded-full bg-[var(--color-primary-light)]/60"
            style={{ animationDelay: "0.9s" }}
          />
          <span
            className="absolute right-1/4 bottom-2 h-4 w-4 [animation:float-slow_4.5s_ease-in-out_infinite] rounded-full bg-[var(--color-primary)]/35"
            style={{ animationDelay: "1.4s" }}
          />
          <span
            className="absolute top-4 left-1/4 h-2 w-2 [animation:float-slow_3.5s_ease-in-out_infinite] rounded-full bg-[var(--color-accent)]/45"
            style={{ animationDelay: "0.6s" }}
          />
        </div>

        {/* Right: text content */}
        <div className="text-center lg:text-right" dir="rtl">
          <span className="inline-flex [animation:fade-in-up_0.6s_ease-out_forwards] items-center gap-1.5 rounded-full bg-white/70 px-4 py-1.5 text-xs font-[var(--font-heading-ur)] font-semibold text-[var(--color-primary)] opacity-0 shadow-sm backdrop-blur-sm">
            <Zap size={13} className="text-[var(--color-accent)]" />
            پورے پاکستان میں تیز ڈیلیوری
          </span>

          <h1 className="mt-4 [animation:fade-in-up_0.6s_ease-out_0.15s_forwards] text-3xl leading-tight font-[var(--font-heading-ur)] font-bold text-[var(--color-primary)] opacity-0 sm:text-4xl">
            اپنی یادوں کو بنائیں
          </h1>
          <h1 className="mt-1 [animation:fade-in-up_0.6s_ease-out_0.3s_forwards] text-4xl leading-tight font-[var(--font-heading-ur)] font-bold text-[var(--color-accent)] opacity-0 sm:text-5xl">
            خوبصورت تحفوں کی صورت
          </h1>

          <p className="mx-auto mt-4 max-w-md [animation:fade-in-up_0.6s_ease-out_0.45s_forwards] text-base leading-relaxed font-[var(--font-heading-ur)] text-[var(--color-text-dark)]/70 opacity-0 lg:mx-0">
            اپنی پسندیدہ تصویر اپ لوڈ کریں اور مختلف گفٹ آئٹمز پر پریمیئم کوالٹی کے ساتھ
            پرنٹ کروا کر اپنے پیارون کو ایک خاص تحفہ دیں۔
          </p>
          <div className="mt-6 flex [animation:fade-in-up_0.6s_ease-out_0.6s_forwards] flex-col items-center gap-3 opacity-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 lg:justify-end">
            <Link
              href="/customize"
              className="flex w-64 max-w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-xs font-[var(--font-heading-ur)] font-semibold text-white shadow-[var(--color-accent)]/30 shadow-lg transition-transform hover:scale-105 hover:bg-[var(--color-accent-hover)] sm:w-auto sm:gap-2 sm:px-7 sm:py-3 sm:text-sm"
            >
              <Upload size={14} className="sm:hidden" />
              <Upload size={16} className="hidden sm:block" />
              اپنی تصویر اپ لوڈ کریں
            </Link>
            <Link
              href="/shop"
              className="flex w-64 max-w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-[var(--font-heading-ur)] font-semibold text-white shadow-[var(--color-primary)]/30 shadow-lg transition-transform hover:scale-105 hover:bg-[var(--color-primary-light)] sm:w-auto sm:gap-2 sm:px-7 sm:py-3 sm:text-sm"
            >
              <ShoppingCart size={14} className="sm:hidden" />
              <ShoppingCart size={16} className="hidden sm:block" />
              ابھی آرڈر کریں
            </Link>
          </div>

          <div className="mt-6 [animation:fade-in-up_0.6s_ease-out_0.75s_forwards] opacity-0">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:translate-x-[30px] lg:justify-end">
              <FeatureBadge icon={ShieldCheck} label="محفوظ ادائیگی" />
              <span className="hidden h-4 w-px bg-[var(--color-text-dark)]/20 sm:block" />
              <FeatureBadge icon={Truck} label="تیز ڈیلیوری" />
              <span className="hidden h-4 w-px bg-[var(--color-text-dark)]/20 sm:block" />
              <FeatureBadge icon={Sparkles} label="پریمیئم کوالٹی" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureBadge({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-[var(--font-heading-ur)] font-semibold text-[var(--color-text-dark)]/80">
      <Icon size={15} className="text-[var(--color-primary)]" />
      {label}
    </span>
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
