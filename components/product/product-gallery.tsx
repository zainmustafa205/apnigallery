"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type GalleryImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
};

type Props = {
  images: GalleryImage[];
  productName: string;
};

export default function ProductGallery({ images, productName }: Props) {
  const hasImages = images.length > 0;

  const defaultIndex = hasImages
    ? Math.max(
        images.findIndex((img) => img.isPrimary),
        0
      )
    : 0;

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [zoomOpen, setZoomOpen] = useState(false);

  if (!hasImages) {
    return (
      <div className="mx-auto flex aspect-square w-full max-w-md items-center justify-center rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface-alt)] text-[var(--color-text-dark)]/40">
        No Image Available
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-full">
      <div className="flex flex-col gap-3 sm:flex-row-reverse">
        {/* Main image */}
        <div className="flex-1">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="relative block aspect-square w-full overflow-hidden rounded-2xl border border-[var(--color-lavender)] bg-[var(--color-surface-alt)] shadow-sm transition-shadow hover:shadow-md"
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productName}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 40vw"
              priority
            />
          </button>
        </div>

        {/* Thumbnails: row below on mobile, column on the left on desktop */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 sm:max-h-[420px] sm:flex-col sm:overflow-x-visible sm:overflow-y-auto sm:pb-0">
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-16 sm:w-16 ${
                  index === selectedIndex
                    ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/30"
                    : "border-[var(--color-lavender)] opacity-70 hover:border-[var(--color-primary-light)] hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={24} />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || productName}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
