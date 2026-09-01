import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma/client";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { Pagination } from "@/components/shop/pagination";
import { SectionHeading } from "@/components/shared/section-heading";

const PAGE_SIZE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const where: Prisma.ProductWhereInput = {
    status: { in: ["ACTIVE", "OUT_OF_STOCK"] },
  };

  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.search) {
    where.name = { contains: params.search, mode: "insensitive" };
  }
  if (params.minPrice || params.maxPrice) {
    where.basePrice = {};
    if (params.minPrice) where.basePrice.gte = parseFloat(params.minPrice);
    if (params.maxPrice) where.basePrice.lte = parseFloat(params.maxPrice);
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { basePrice: "asc" };
  if (params.sort === "price-desc") orderBy = { basePrice: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        name: true,
        basePrice: true,
        isCustomizable: true,
        status: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        variants: { where: { isActive: true }, select: { id: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function buildPageHref(targetPage: number) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);
    if (params.sort) query.set("sort", params.sort);
    if (params.search) query.set("search", params.search);
    if (targetPage > 1) query.set("page", String(targetPage));
    return `/shop?${query.toString()}`;
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-10">
      <SectionHeading title="All Products" subtitle="ہماری تمام مصنوعات" />

      <div className="flex justify-center">
        <ShopFilters categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-[var(--color-text-dark)]/50">
          No products found matching your filters.
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              outOfStock={product.status === "OUT_OF_STOCK"}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                basePrice: product.basePrice.toNumber(),
                isCustomizable: product.isCustomizable,
                imageUrl: product.images[0]?.url ?? null,
                variantCount: product.variants.length,
                singleVariantId:
                  product.variants.length === 1 ? product.variants[0].id : null,
              }}
            />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} buildHref={buildPageHref} />
    </div>
  );
}
