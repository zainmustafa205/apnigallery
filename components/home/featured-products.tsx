import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";

export async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, status: "ACTIVE" },
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
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 pt-6 pb-2 sm:pt-10 sm:pb-4">
      <SectionHeading title="ہماری مقبول مصنوعات" />
      <HorizontalScroller>
        {cards.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </HorizontalScroller>
    </section>
  );
}
