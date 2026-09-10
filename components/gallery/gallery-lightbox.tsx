"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItemData } from "./gallery-grid";

interface GalleryLightboxProps {
  items: GalleryItemData[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const item = items[activeIndex];

  const goPrev = () => onNavigate(activeIndex === 0 ? items.length - 1 : activeIndex - 1);
  const goNext = () => onNavigate(activeIndex === items.length - 1 ? 0 : activeIndex + 1);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        aria-label="Close"
      >
        <X size={22} />
      </button>

      <div
        className="relative flex flex-1 items-center justify-center px-4 py-16"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {items.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-2 z-10 hidden rounded-full bg-white/10 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20 sm:flex sm:opacity-60 sm:hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="relative h-full max-h-[75vh] w-full max-w-3xl">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        {items.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 z-10 hidden rounded-full bg-white/10 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20 sm:flex sm:opacity-60 sm:hover:opacity-100"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      <div
        className="px-4 pb-6 text-center text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold sm:text-base">{item.title}</p>
        {item.description && (
          <p className="mt-1 text-xs text-white/70 sm:text-sm">{item.description}</p>
        )}
        {item.category && (
          <p className="mt-1 text-[11px] text-white/50">{item.category.name}</p>
        )}
      </div>
    </div>
  );
}
