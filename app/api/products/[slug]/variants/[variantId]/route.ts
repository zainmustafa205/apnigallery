import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

const updateVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  priceAdjustment: z.number().optional(),
  stock: z.number().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const body = await request.json();
    const parsed = updateVariantSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const existing = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) {
      return errorResponse("Variant not found", 404);
    }

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: parsed.data,
    });

    return successResponse(variant);
  } catch (error) {
    console.error("PATCH variant error:", error);
    return errorResponse("Failed to update variant", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ variantId: string }> }
) {
  try {
    const { variantId } = await params;

    const existing = await prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) {
      return errorResponse("Variant not found", 404);
    }

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive: false },
    });

    return successResponse({ message: "Variant deactivated successfully", variant });
  } catch (error) {
    console.error("DELETE variant error:", error);
    return errorResponse("Failed to deactivate variant", 500);
  }
}
