import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import prisma from "@/lib/prisma";
import { SectionHeading } from "@/components/shared/section-heading";

export async function CategoryGrid() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true, image: true },
  });

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 pt-2 pb-6 sm:pt-4 sm:pb-10">
      <SectionHeading title="اپنی پسند، اپنا انداز" />

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-5 sm:gap-x-5 sm:gap-y-7">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group flex w-[45%] flex-col items-center gap-2 text-center sm:w-40"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[var(--color-lavender)] shadow-sm transition-transform group-hover:scale-105 group-hover:shadow-md">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, 160px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package size={24} className="text-[var(--color-primary)]/40" />
                </div>
              )}
            </div>
            <span className="line-clamp-1 text-xs font-medium text-[var(--color-text-dark)] sm:text-sm">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
