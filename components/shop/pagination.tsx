import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-lavender)] text-[var(--color-primary)] ${
          currentPage === 1
            ? "pointer-events-none opacity-30"
            : "hover:bg-[var(--color-lavender)]"
        }`}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            page === currentPage
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text-dark)] hover:bg-[var(--color-lavender)]"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-lavender)] text-[var(--color-primary)] ${
          currentPage === totalPages
            ? "pointer-events-none opacity-30"
            : "hover:bg-[var(--color-lavender)]"
        }`}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
