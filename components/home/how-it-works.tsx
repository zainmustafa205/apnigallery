"use client";

import { useEffect, useRef, useState } from "react";
import { Cloud, Gift, Printer, Truck } from "lucide-react";
import type { ComponentType } from "react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: Cloud,
    title: "اپنی تصویر اپ لوڈ کریں",
    subtitle: "بس ایک تصویر، اور کام شروع",
    color: "var(--color-primary)",
  },
  {
    icon: Gift,
    title: "اپنی پسند کا پروڈکٹ منتخب کریں",
    subtitle: "اپ کی پسند، آپ کا انداز",
    color: "var(--color-accent)",
  },
  {
    icon: Printer,
    title: "ہم پرنٹ کریں گے",
    subtitle: "جدید مشینوں سے بہترین پرنٹنگ",
    color: "var(--color-primary-light)",
  },
  {
    icon: Truck,
    title: "گھر بیٹھے حاصل کریں",
    subtitle: "تیز اور محفوظ ڈیلیوری آپ کے دروازے تک",
    color: "var(--color-accent-hover)",
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-7xl overflow-hidden px-4 pt-6 pb-8 sm:pt-10 sm:pb-14"
    >
      <SectionHeading title="آرڈر کرنے کا آسان طریقہ" />

      {/* Desktop: horizontal row with connector lines */}
      <div className="relative hidden sm:grid sm:grid-cols-4 sm:gap-4">
        {steps.map((step, index) => (
          <div key={index} className="relative px-2">
            {index < steps.length - 1 && (
              <div className="absolute top-10 right-0 hidden w-full translate-x-1/2 -translate-y-1/2 border-t-2 border-dashed border-[var(--color-accent)]/40 sm:block" />
            )}
            <StepCard step={step} index={index} visible={visible} />
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="relative flex flex-col gap-5 sm:hidden" dir="rtl">
        <div className="absolute top-8 right-7 bottom-8 w-0.5 border-r-2 border-dashed border-[var(--color-accent)]/40" />
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex items-center gap-3 transition-all duration-500 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-24px)",
              transitionDelay: `${index * 0.15}s`,
            }}
          >
            <div className="relative z-10 flex-shrink-0">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
                style={{ backgroundColor: step.color }}
              >
                <step.icon size={22} className="text-white" />
              </div>
              <span className="absolute -top-1.5 -left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white shadow-md">
                {index + 1}
              </span>
            </div>

            <div className="flex-1 rounded-xl border border-[var(--color-lavender)] bg-[var(--color-surface)] px-3 py-2.5 shadow-sm">
              <p className="text-xs font-[var(--font-heading-ur)] font-bold text-[var(--color-text-dark)]">
                {step.title}
              </p>
              <p className="mt-0.5 text-[10px] font-[var(--font-heading-ur)] text-[var(--color-text-dark)]/60">
                {step.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  visible,
}: {
  step: {
    icon: ComponentType<{ size?: number; className?: string }>;
    title: string;
    subtitle: string;
    color: string;
  };
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="relative flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-24px)",
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      <div className="relative">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ backgroundColor: step.color }}
        >
          <step.icon size={30} className="text-white" />
        </div>
        <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white shadow-md">
          {index + 1}
        </span>
      </div>

      <div className="text-center" dir="rtl">
        <p className="text-sm font-[var(--font-heading-ur)] font-bold text-[var(--color-text-dark)]">
          {step.title}
        </p>
        <p className="mt-1 text-xs font-[var(--font-heading-ur)] text-[var(--color-text-dark)]/60">
          {step.subtitle}
        </p>
      </div>
    </div>
  );
}
