import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";

// TODO: Update this slug once the "Corporate/Bulk Gifts" category
// is created in Prisma Studio — check Category.slug field there.
const BUSINESS_CATEGORY_SLUG = "corporate-bulk-gifts";

export async function BusinessCollection() {
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      category: { slug: BUSINESS_CATEGORY_SLUG },
    },
    take: 12,
    select: {
      id: true,
      slug: true,
      name: true,
      basePrice: true,
      isCustomizable: true,
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      variants: { where: { isActive: true }, select: { id: true } },
    },
  });

  if (products.length === 0) return null;

  const cards = products.map((product) => ({
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
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 pt-2 pb-6 sm:pt-4 sm:pb-10">
      <SectionHeading title="Business Collection" dir="ltr" />
      <HorizontalScroller>
        {cards.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </HorizontalScroller>
    </section>
  );
}
