"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

type Category = { name: string; slug: string };

const PRICE_RANGES = [
  { label: "All Prices", value: "" },
  { label: "Under Rs. 500", value: "0-500" },
  { label: "Rs. 500 - 1000", value: "500-1000" },
  { label: "Rs. 1000 - 2000", value: "1000-2000" },
  { label: "Rs. 2000+", value: "2000-" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activePrice =
    `${searchParams.get("minPrice") ?? ""}-${searchParams.get("maxPrice") ?? ""}`.replace(
      /^-$/,
      ""
    );
  const activeSort = searchParams.get("sort") ?? "newest";

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  }

  function handlePriceChange(value: string) {
    if (!value) {
      updateParams({ minPrice: null, maxPrice: null });
      return;
    }
    const [min, max] = value.split("-");
    updateParams({ minPrice: min || null, maxPrice: max || null });
  }

  return (
    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
      {/* Category chips */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 sm:pb-0">
        <div className="mx-auto flex w-fit gap-2 sm:mx-0">
          <button
            onClick={() => updateParams({ category: null })}
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
              onClick={() => updateParams({ category: cat.slug })}
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

      {/* Price + Sort dropdowns */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal
          size={16}
          className="hidden text-[var(--color-text-dark)]/50 sm:block"
        />
        <StyledSelect
          value={activePrice}
          onChange={handlePriceChange}
          options={PRICE_RANGES}
        />
        <StyledSelect
          value={activeSort}
          onChange={(v) => updateParams({ sort: v === "newest" ? null : v })}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
}

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="group relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="peer appearance-none rounded-full border border-[var(--color-primary)]/25 bg-[var(--color-surface)] py-2 pr-9 pl-4 text-xs font-medium text-[var(--color-text-dark)] shadow-sm transition-colors outline-none hover:border-[var(--color-primary)]/50 focus:border-[var(--color-primary)] sm:text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-primary)] transition-transform duration-200 peer-focus:rotate-180"
      />
    </div>
  );
}
