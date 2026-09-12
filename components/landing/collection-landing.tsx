import { ProductCard } from "@/components/product/product-card";

type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  isCustomizable: boolean;
  imageUrl: string | null;
  variantCount: number;
  singleVariantId: string | null;
};

interface CollectionLandingProps {
  category: {
    name: string;
    products: ProductCardData[];
  };
}

export function CollectionLanding({ category }: CollectionLandingProps) {
  if (category.products.length === 0) {
    return (
      <p className="text-text-dark/60 text-center">
        Is collection me abhi koi product available nahi hai.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {category.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
