import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { generateSlug } from "@/lib/generateSlug";
import { z } from "zod";

// ---------- GET: List all categories (tree structure) ----------
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null, isActive: true }, // top-level only
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return successResponse(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return errorResponse("Failed to fetch categories", 500);
  }
}

// ---------- POST: Create a new category ----------
const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  sortOrder: z.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const { name, description, image, parentId, sortOrder } = parsed.data;
    const slug = generateSlug(name);

    // duplicate slug check
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("A category with this name already exists", 409);
    }

    const category = await prisma.category.create({
      data: { name, slug, description, image, parentId, sortOrder },
    });

    return successResponse(category, 201);
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return errorResponse("Failed to create category", 500);
  }
}
