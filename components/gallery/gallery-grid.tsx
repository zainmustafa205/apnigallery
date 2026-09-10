"use client";

import { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { GalleryLightbox } from "./gallery-lightbox";

export interface GalleryItemData {
  id: string;
  title: string;
  imageUrl: string;
  description: string | null;
  isFeatured: boolean;
  category: { name: string; slug: string } | null;
}

export function GalleryGrid({ items }: { items: GalleryItemData[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className="group bg-lavender relative aspect-square overflow-hidden rounded-lg"
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {item.isFeatured && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                <Star size={10} fill="white" />
                Featured
              </div>
            )}

            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="w-full truncate p-2 text-left text-xs font-medium text-white">
                {item.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <GalleryLightbox
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}
