import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { OrderBuilder } from "@/components/customize/order-builder";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProductForCustomize(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { where: { isActive: true } },
      images: true,
    },
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductForCustomize(slug);

  if (!product) {
    return { title: "Product Not Found | ApniGallery" };
  }
  if (product.status === "DRAFT" || product.status === "ARCHIVED") {
    return { title: "Product Not Found | ApniGallery" };
  }
  if (!product.isCustomizable || !product.customizationType) {
    return { title: "Product Not Found | ApniGallery" };
  }

  return {
    title: `Customize ${product.name} | ApniGallery`,
    description: `Design your own ${product.name} — upload a photo, add text, and preview it live before you order.`,
  };
}

export default async function CustomizePage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductForCustomize(slug);

  if (!product) {
    notFound();
  }
  if (product.status === "DRAFT" || product.status === "ARCHIVED") {
    notFound();
  }
  if (!product.isCustomizable || !product.customizationType) {
    notFound();
  }

  // Is line ke neeche TypeScript ko pata hai: product non-null hai
  // AND product.customizationType non-null hai (upar teeno if-blocks ki wajah se)

  const mockupImage =
    product.images.find((img) => img.isMockup) ??
    product.images.find((img) => img.isPrimary) ??
    product.images[0] ??
    null;

  const basePrice = Number(product.basePrice);
  const variants = product.variants.map((v) => ({
    ...v,
    priceAdjustment: Number(v.priceAdjustment),
  }));

  return (
    <OrderBuilder
      productId={product.id}
      productName={product.name}
      productSlug={product.slug}
      basePrice={basePrice}
      customizationType={product.customizationType}
      mockupImageUrl={mockupImage?.url ?? null}
      variants={variants}
    />
  );
}
