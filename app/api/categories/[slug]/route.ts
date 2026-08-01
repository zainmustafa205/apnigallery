import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

// ---------- GET: Single category by slug ----------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    return successResponse(category);
  } catch (error) {
    console.error("GET /api/categories/[slug] error:", error);
    return errorResponse("Failed to fetch category", 500);
  }
}

// ---------- PATCH: Update category ----------
const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = updateCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) {
      return errorResponse("Category not found", 404);
    }

    const category = await prisma.category.update({
      where: { slug },
      data: parsed.data,
    });

    return successResponse(category);
  } catch (error) {
    console.error("PATCH /api/categories/[slug] error:", error);
    return errorResponse("Failed to update category", 500);
  }
}

// ---------- DELETE: Remove category (with safety check) ----------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) {
      return errorResponse("Category not found", 404);
    }

    if (category._count.products > 0 || category._count.children > 0) {
      return errorResponse(
        "Cannot delete category with existing products or sub-categories",
        409
      );
    }

    await prisma.category.delete({ where: { slug } });

    return successResponse({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/categories/[slug] error:", error);
    return errorResponse("Failed to delete category", 500);
  }
}
