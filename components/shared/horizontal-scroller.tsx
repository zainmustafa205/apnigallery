"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HorizontalScroller({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="group relative">
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute top-1/2 left-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-[var(--color-lavender)] sm:flex"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scrollRef}
        className="-mx-4 [scrollbar-width:none] overflow-x-auto scroll-smooth px-4 pb-3 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="mx-auto flex w-fit items-start gap-3 sm:gap-4">{children}</div>
      </div>

      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute top-1/2 right-1 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-primary)] opacity-0 shadow-md transition-opacity group-hover:opacity-100 hover:bg-[var(--color-lavender)] sm:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
