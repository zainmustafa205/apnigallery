import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryGrid } from "@/components/home/category-grid";
import { BusinessCollection } from "@/components/home/business-collection";
import { HowItWorks } from "@/components/home/how-it-works";
import { FeatureStrip } from "@/components/home/feature-strip";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturedProducts />
      <CategoryGrid />
      <BusinessCollection />
      <HowItWorks />
      <FeatureStrip />
    </div>
  );
}
