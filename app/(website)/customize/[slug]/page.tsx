import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { OrderBuilder } from "@/components/customize/order-builder";
import type { DesignElement } from "@/lib/design-types";
import { cookies } from "next/headers";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ designId?: string }>;
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

export default async function CustomizePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { designId: designIdParam } = await searchParams;
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

  // Resolve which design (if any) to pre-load, in priority order:
  // 1. Explicit ?designId= in the URL (came from "Customize Further" with
  //    Quick Fields data, or a direct link).
  // 2. This browser's last-used design for this specific product (cookie) —
  //    a pure UX convenience for resuming work, NOT an ownership mechanism.
  //    Ownership is still enforced by the design's own unguessable id.
  let designId = designIdParam ?? null;

  if (!designId) {
    const cookieStore = await cookies();
    designId = cookieStore.get(`design_${product.id}`)?.value ?? null;
  }

  let initialElements: DesignElement[] = [];
  let initialDesignId: string | null = null;

  if (designId) {
    const existingDesign = await prisma.design.findUnique({
      where: { id: designId },
      select: { id: true, productId: true, elements: true },
    });

    // Safety check: sirf tab load karo jab design ISI product ka ho —
    // koi purani/stale ya galat URL se doosre product ka design na khul jaye.
    if (existingDesign && existingDesign.productId === product.id) {
      initialElements =
        (existingDesign.elements as unknown as DesignElement[] | null) ?? [];
      initialDesignId = existingDesign.id;
    }
  }

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
      productDescription={product.description}
      basePrice={basePrice}
      customizationType={product.customizationType}
      mockupImageUrl={mockupImage?.url ?? null}
      variants={variants}
      initialElements={initialElements}
      initialDesignId={initialDesignId}
    />
  );
}
