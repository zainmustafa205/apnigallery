"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Category = { name: string; slug: string };

export function GalleryFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";

  function handleCategoryChange(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/gallery?${qs}` : "/gallery");
  }

  return (
    <div className="-mx-4 mb-8 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex sm:justify-center sm:px-0 sm:pb-0">
      <div className="mx-auto flex w-fit gap-2 sm:mx-0">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
            !activeCategory
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-lavender)] text-[var(--color-text-dark)]"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
              activeCategory === cat.slug
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-lavender)] text-[var(--color-text-dark)]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
