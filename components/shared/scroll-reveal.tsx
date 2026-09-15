"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  duration = 650,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Respect users who prefer reduced motion
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={
        visible
          ? {
              animation: `fade-in-up ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
            }
          : {
              opacity: 0,
              transform: "translateY(24px)",
            }
      }
    >
      {children}
    </div>
  );
}
