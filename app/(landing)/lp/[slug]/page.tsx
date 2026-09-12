import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { LandingHero } from "@/components/landing/landing-hero";
import { SingleProductLanding } from "@/components/landing/single-product-landing";
import { CollectionLanding } from "@/components/landing/collection-landing";

interface LandingPageProps {
  params: Promise<{ slug: string }>;
}

async function getLandingPage(slug: string) {
  const landingPage = await prisma.landingPage.findUnique({
    where: { slug },
  });

  if (!landingPage || !landingPage.isActive) return null;

  if (landingPage.type === "SINGLE_PRODUCT") {
    if (!landingPage.productId) return null;

    const product = await prisma.product.findUnique({
      where: { id: landingPage.productId, status: "ACTIVE" },
      include: {
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) return null;

    const serializedProduct = {
      ...product,
      basePrice: Number(product.basePrice),
      variants: product.variants.map((v) => ({
        ...v,
        priceAdjustment: Number(v.priceAdjustment),
      })),
    };

    return { landingPage, product: serializedProduct, category: null };
  }

  // COLLECTION
  if (!landingPage.categoryId) return null;

  const category = await prisma.category.findUnique({
    where: { id: landingPage.categoryId, isActive: true },
    include: {
      products: {
        where: { status: "ACTIVE" },
        include: {
          variants: { where: { isActive: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
  });

  if (!category) return null;

  const cardProducts = category.products.map((p) => {
    const primaryImage = p.images.find((img) => img.isPrimary) ?? p.images[0];
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      basePrice: Number(p.basePrice),
      isCustomizable: p.isCustomizable,
      imageUrl: primaryImage?.url ?? null,
      variantCount: p.variants.length,
      singleVariantId: p.variants.length === 1 ? p.variants[0].id : null,
    };
  });

  return {
    landingPage,
    product: null,
    category: { name: category.name, products: cardProducts },
  };
}

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLandingPage(slug);
  if (!data) return {};

  const { landingPage } = data;
  return {
    title: landingPage.title,
    description: landingPage.adCopy ?? undefined,
    openGraph: {
      title: landingPage.title,
      description: landingPage.adCopy ?? undefined,
      images: landingPage.bannerImage ? [landingPage.bannerImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: landingPage.title,
      description: landingPage.adCopy ?? undefined,
      images: landingPage.bannerImage ? [landingPage.bannerImage] : undefined,
    },
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { slug } = await params;
  const data = await getLandingPage(slug);

  if (!data) notFound();

  const { landingPage, product, category } = data;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <LandingHero
        title={landingPage.title}
        bannerImage={landingPage.bannerImage}
        adCopy={landingPage.adCopy}
      />

      {landingPage.type === "SINGLE_PRODUCT" && product ? (
        <SingleProductLanding product={product} />
      ) : category ? (
        <CollectionLanding category={category} />
      ) : null}
    </div>
  );
}
