import prisma from "@/lib/prisma";
import { HeroCarousel } from "./hero-carousel";
import { HeroFallback } from "./hero-fallback";

export async function HeroSection() {
  const banners = await prisma.heroBanner.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, imageUrl: true, linkUrl: true },
  });

  return banners.length > 0 ? <HeroCarousel banners={banners} /> : <HeroFallback />;
}
