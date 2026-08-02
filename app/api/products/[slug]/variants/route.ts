import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

const addVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  priceAdjustment: z.number().optional(),
  stock: z.number().optional(),
  image: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = addVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    const variant = await prisma.productVariant.create({
      data: { ...parsed.data, productId: product.id },
    });

    return successResponse(variant, 201);
  } catch (error: any) {
    console.error("POST variant error:", error);
    if (error.code === "P2002") {
      return errorResponse("A variant with this SKU already exists", 409);
    }
    return errorResponse("Failed to add variant", 500);
  }
}
