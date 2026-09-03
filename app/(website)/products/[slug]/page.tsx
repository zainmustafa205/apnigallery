// app/(website)/products/[slug]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ProductGallery from "@/components/product/product-gallery";
import AddToCartPanel from "@/components/product/add-to-cart-panel";
import ProductDetailsAccordion from "@/components/product/product-details-accordion";
import { CARE_INSTRUCTIONS, DELIVERY_INFO } from "@/lib/product-policy-content";
import { HorizontalScroller } from "@/components/shared/horizontal-scroller";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProductCard } from "@/components/product/product-card";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
      },
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!product) return null;
  if (product.status === "DRAFT" || product.status === "ARCHIVED") return null;

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: currentProductId },
      status: { in: ["ACTIVE", "OUT_OF_STOCK"] },
    },
    include: {
      variants: { where: { isActive: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    take: 8,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.seoTitle || product.name;
  const description =
    product.seoDescription || product.description?.slice(0, 160) || undefined;

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: primaryImage
        ? [{ url: primaryImage, width: 1000, height: 1000 }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  const basePrice = Number(product.basePrice);
  const variantsForClient = product.variants.map((v) => ({
    id: v.id,
    size: v.size,
    color: v.color,
    material: v.material,
    sku: v.sku,
    priceAdjustment: Number(v.priceAdjustment),
    stock: v.stock,
  }));

  const accordionSections = [
    ...(product.description
      ? [{ id: "description", title: "Description", content: product.description }]
      : []),
    { id: "care", title: "Care Instructions", content: CARE_INSTRUCTIONS },
    { id: "delivery", title: "Delivery & Returns", content: DELIVERY_INFO },
  ];

  const relatedProductsForCard = relatedProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    basePrice: Number(p.basePrice),
    isCustomizable: p.isCustomizable,
    imageUrl: p.images[0]?.url ?? null,
    variantCount: p.variants.length,
    singleVariantId: p.variants.length === 1 ? p.variants[0].id : null,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Gallery */}
        <ProductGallery images={product.images} productName={product.name} />

        {/* Right: Product Info */}
        <div className="flex flex-col gap-5">
          <div>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="text-xs font-medium tracking-wide text-[var(--color-accent)] uppercase"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-1 text-2xl font-bold text-[var(--color-text-dark)] sm:text-3xl">
              {product.name}
            </h1>
          </div>

          <div className="border-t border-[var(--color-lavender)] pt-5">
            <AddToCartPanel
              productId={product.id}
              productSlug={product.slug}
              isCustomizable={product.isCustomizable}
              variants={variantsForClient}
              basePrice={basePrice}
            />
          </div>

          <div className="border-t border-[var(--color-lavender)] pt-5">
            <ProductDetailsAccordion sections={accordionSections} />
          </div>
        </div>
      </div>

      {relatedProductsForCard.length > 0 && (
        <div className="mt-12">
          <SectionHeading
            title="You May Also Like"
            subtitle="آپ کو یہ بھی پسند آسکتے ہیں"
          />
          <HorizontalScroller>
            {relatedProductsForCard.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </HorizontalScroller>
        </div>
      )}
    </div>
  );
}
