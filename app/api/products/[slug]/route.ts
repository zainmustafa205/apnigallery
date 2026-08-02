import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

// ---------- GET: Single product with full detail ----------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return errorResponse("Failed to fetch product", 500);
  }
}

// ---------- PATCH: Update product basic fields ----------
const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  basePrice: z.number().positive().optional(),
  isCustomizable: z.boolean().optional(),
  isBulkAvailable: z.boolean().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "OUT_OF_STOCK", "ARCHIVED"]).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return errorResponse("Product not found", 404);
    }

    const product = await prisma.product.update({
      where: { slug },
      data: parsed.data,
      include: { variants: true, images: true, category: true },
    });

    return successResponse(product);
  } catch (error) {
    console.error("PATCH /api/products/[slug] error:", error);
    return errorResponse("Failed to update product", 500);
  }
}

// ---------- DELETE: Soft-delete (archive) product ----------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) {
      return errorResponse("Product not found", 404);
    }

    const product = await prisma.product.update({
      where: { slug },
      data: { status: "ARCHIVED" },
    });

    return successResponse({
      message: "Product archived successfully",
      product,
    });
  } catch (error) {
    console.error("DELETE /api/products/[slug] error:", error);
    return errorResponse("Failed to archive product", 500);
  }
}
