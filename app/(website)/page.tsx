import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryShowcase } from "@/components/home/category-showcase";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
    </div>
  );
}
