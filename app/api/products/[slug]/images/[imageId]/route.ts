import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/apiResponse";
import { z } from "zod";

// ---------- PATCH: Update image metadata ----------
const updateImageSchema = z.object({
  altText: z.string().optional(),
  sortOrder: z.number().optional(),
  isPrimary: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;
    const body = await request.json();
    const parsed = updateImageSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 422);
    }

    const existing = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!existing) {
      return errorResponse("Image not found", 404);
    }

    const image = await prisma.$transaction(async (tx) => {
      if (parsed.data.isPrimary) {
        await tx.productImage.updateMany({
          where: { productId: existing.productId, id: { not: imageId } },
          data: { isPrimary: false },
        });
      }

      return tx.productImage.update({
        where: { id: imageId },
        data: parsed.data,
      });
    });

    return successResponse(image);
  } catch (error) {
    console.error("PATCH image error:", error);
    return errorResponse("Failed to update image", 500);
  }
}

// ---------- DELETE: Remove image (database + Cloudinary) ----------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await params;

    const existing = await prisma.productImage.findUnique({ where: { id: imageId } });
    if (!existing) {
      return errorResponse("Image not found", 404);
    }

    // Delete from Cloudinary first (if publicId exists)
    if (existing.publicId) {
      await cloudinary.uploader.destroy(existing.publicId);
    }

    // Then delete from database
    await prisma.productImage.delete({ where: { id: imageId } });

    return successResponse({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("DELETE image error:", error);
    return errorResponse("Failed to delete image", 500);
  }
}
