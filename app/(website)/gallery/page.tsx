import prisma from "@/lib/prisma";

import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { Pagination } from "@/components/shop/pagination";
import { SectionHeading } from "@/components/shared/section-heading";

const PAGE_SIZE = 16;

interface GalleryPageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const currentPage = Math.max(1, Number(params.page) || 1);

  const where = categorySlug ? { category: { slug: categorySlug, isActive: true } } : {};

  const [items, totalCount, categories] = await Promise.all([
    prisma.galleryItem.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.galleryItem.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const buildHref = (page: number) => {
    const sp = new URLSearchParams();
    if (categorySlug) sp.set("category", categorySlug);
    if (page > 1) sp.set("page", String(page));
    const qs = sp.toString();
    return qs ? `/gallery?${qs}` : "/gallery";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading title="Our Work" subtitle="ہمارا مکمل کیا گیا کام" />

      <GalleryFilters categories={categories} />
      {items.length === 0 ? (
        <p className="text-text-dark/60 mt-10 text-center">
          Is category me abhi koi gallery item nahi hai.
        </p>
      ) : (
        <GalleryGrid items={items} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildHref}
        />
      )}
    </div>
  );
}
