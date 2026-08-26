import Link from "next/link";
import Image from "next/image";
import { Package, ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";

export async function CategoryShowcase() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      products: {
        where: { status: "ACTIVE" },
        take: 8,
        select: {
          id: true,
          slug: true,
          name: true,
          basePrice: true,
          isCustomizable: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true },
          },
          variants: {
            where: { isActive: true },
            select: { id: true },
          },
        },
      },
    },
  });

  const categoriesWithProducts = categories.filter((c) => c.products.length > 0);

  if (categoriesWithProducts.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      {categoriesWithProducts.map((category) => {
        const cards = category.products.map((product) => ({
          id: product.id,
          slug: product.slug,
          name: product.name,
          basePrice: product.basePrice.toNumber(),
          isCustomizable: product.isCustomizable,
          imageUrl: product.images[0]?.url ?? null,
          variantCount: product.variants.length,
          singleVariantId: product.variants.length === 1 ? product.variants[0].id : null,
        }));

        return (
          <section key={category.id} className="w-full overflow-hidden px-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <Link
                href={`/shop?category=${category.slug}`}
                className="group flex items-center gap-3"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[var(--color-lavender)] shadow-sm sm:h-16 sm:w-16">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package size={24} className="text-[var(--color-primary)]/50" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-primary)] sm:text-xl">
                    {category.name}
                  </h2>
                  <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] transition-transform group-hover:-translate-x-1">
                    سب دیکھیں <ArrowLeft size={12} />
                  </span>
                </div>
              </Link>
            </div>

            <div className="mt-4">
              <HorizontalScroller>
                {cards.map((product) => (
                  <ProductCard key={product.id} product={product} compact />
                ))}
              </HorizontalScroller>
            </div>
          </section>
        );
      })}
    </div>
  );
}
