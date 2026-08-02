import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { Prisma } from "@/lib/generated/prisma/client";

import { generateSlug } from "@/lib/generateSlug";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get("category"); // slug
    const search = searchParams.get("search");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort"); // "price-asc" | "price-desc" | "newest"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    // ---- Build WHERE clause dynamically ----
    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE", // customer-facing list — sirf active products
    };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = parseFloat(minPrice);
      if (maxPrice) where.basePrice.lte = parseFloat(maxPrice);
    }

    // ---- Build ORDER BY ----
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" }; // default: newest
    if (sort === "price-asc") orderBy = { basePrice: "asc" };
    if (sort === "price-desc") orderBy = { basePrice: "desc" };

    // ---- Query with pagination ----
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return errorResponse("Failed to fetch products", 500);
  }
}

// ---------- POST: Create a new product (with optional variants/images) ----------
const variantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  priceAdjustment: z.number().optional(),
  stock: z.number().optional(),
  image: z.string().optional(),
});

const imageSchema = z.object({
  url: z.string().min(1, "Image URL is required"),
  altText: z.string().optional(),
  isPrimary: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  basePrice: z.number().positive("Price must be greater than 0"),
  isCustomizable: z.boolean().optional(),
  isBulkAvailable: z.boolean().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  variants: z.array(variantSchema).optional(),
  images: z.array(imageSchema).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { variants, images, name, ...rest } = parsed.data;
    const slug = generateSlug(name);

    // duplicate slug check
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      return errorResponse("A product with this name already exists", 409);
    }

    // category existence check
    const category = await prisma.category.findUnique({
      where: { id: rest.categoryId },
    });
    if (!category) {
      return errorResponse("Selected category does not exist", 422);
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        ...rest,
        variants: variants ? { create: variants } : undefined,
        images: images ? { create: images } : undefined,
      },
      include: { variants: true, images: true, category: true },
    });

    return successResponse(product, 201);
  } catch (error: any) {
    console.error("POST /api/products error:", error);

    // Prisma unique constraint error (e.g. duplicate SKU)
    if (error.code === "P2002") {
      return errorResponse(`Duplicate value for: ${error.meta?.target?.join(", ")}`, 409);
    }

    return errorResponse("Failed to create product", 500);
  }
}
