import prisma from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";

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
    <section className="mx-auto w-full max-w-7xl overflow-hidden px-4 py-10 sm:py-14">
      <h2 className="mb-6 text-center text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
        ہماری مقبول مصنوعات
      </h2>
      <div className="-mx-4 flex justify-center gap-4 overflow-x-auto px-4 pb-3 sm:gap-5">
        {cards.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
