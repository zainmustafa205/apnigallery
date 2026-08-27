"use client";

import { useEffect, useRef, useState } from "react";
import { Printer, Award, Truck, Headset, ShieldCheck } from "lucide-react";
import type { ComponentType } from "react";

const features = [
  {
    icon: ShieldCheck,
    color: "#0d9488",
    bg: "#f0fdfa",
    border: "#99f6e4",
    title: "محفوظ ادائیگی کے ذرائع",
    subtitle: "100% محفوظ لین دین",
  },
  {
    icon: Headset,
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    title: "آسان آرڈر اور سیکورٹی",
    subtitle: "24/7 کسٹمر سپورٹ",
  },
  {
    icon: Truck,
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    title: "تیز اور محفوظ ڈیلیوری",
    subtitle: "پورے پاکستان میں",
  },
  {
    icon: Award,
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    title: "اعلیٰ معیار کا میٹریل",
    subtitle: "پائیدار اور دیرپا استعمال",
  },
  {
    icon: Printer,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    title: "بہترین پرنٹنگ کوالٹی",
    subtitle: "HD سبلیمیشن پرنٹنگ",
  },
];

export function FeatureStrip() {
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [period, setPeriod] = useState(0);
  const [copies, setCopies] = useState(2);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    function measure() {
      const first = groupRefs.current[0];
      const second = groupRefs.current[1];
      if (!first || !second) return;

      const groupPeriod = second.offsetLeft - first.offsetLeft;
      if (groupPeriod <= 0) return;

      const needed = Math.ceil((window.innerWidth * 2) / groupPeriod) + 1;

      setPeriod(groupPeriod);
      setCopies((prev) => (needed !== prev ? needed : prev));
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [copies]);

  const duration = Math.max(period / 40, 12);

  return (
    <section className="w-full overflow-hidden bg-[var(--color-surface-alt)] py-5 sm:py-7">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="flex w-fit items-center gap-3 transition-opacity duration-300 sm:gap-5"
        style={{
          opacity: period > 0 ? 1 : 0,
          ...(period > 0
            ? ({
                "--marquee-distance": `${period}px`,
                animation: `marquee-scroll-px ${duration}s linear infinite`,
                animationPlayState: paused ? "paused" : "running",
              } as React.CSSProperties)
            : {}),
        }}
      >
        {Array.from({ length: copies }).map((_, groupIndex) => (
          <div
            key={groupIndex}
            ref={(el) => {
              groupRefs.current[groupIndex] = el;
            }}
            className="flex flex-shrink-0 items-center gap-3 sm:gap-5"
            aria-hidden={groupIndex > 0}
          >
            {features.map((feature, index) => (
              <FeatureItem key={`${groupIndex}-${index}`} {...feature} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureItem({
  icon: Icon,
  color,
  bg,
  border,
  title,
  subtitle,
}: {
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  bg: string;
  border: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      dir="rtl"
      className="flex flex-shrink-0 items-center gap-2.5 rounded-2xl border py-2 pr-3 pl-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md sm:gap-3 sm:py-2.5 sm:pr-4 sm:pl-6"
      style={{ backgroundColor: bg, borderColor: border }}
    >
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-sm sm:h-11 sm:w-11">
        <Icon size={17} style={{ color }} />
      </span>
      <div className="whitespace-nowrap">
        <p className="text-[11px] leading-tight font-[var(--font-heading-ur)] font-bold text-slate-800 sm:text-sm">
          {title}
        </p>
        <p className="text-[9px] leading-tight font-[var(--font-heading-ur)] text-slate-600 sm:text-xs">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
