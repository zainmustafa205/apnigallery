"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Banner = {
  id: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
};

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="relative h-[420px] w-full overflow-hidden sm:h-[520px]">
      {banners.map((banner, index) => {
        const content = (
          <Image
            src={banner.imageUrl}
            alt={banner.title ?? "ApniGallery promotional banner"}
            fill
            priority={index === 0}
            className="object-cover"
          />
        );
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {banner.linkUrl ? <Link href={banner.linkUrl}>{content}</Link> : content}
          </div>
        );
      })}

      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? "w-6 bg-[var(--color-accent)]" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
