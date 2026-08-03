import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { successResponse, errorResponse } from "@/lib/apiResponse";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      return errorResponse("Product not found", 404);
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const isPrimary = formData.get("isPrimary") === "true";
    const altText = formData.get("altText") as string | null;
    const sortOrder = parseInt((formData.get("sortOrder") as string) || "0");

    if (!file) {
      return errorResponse("No file provided", 422);
    }

    // ---- File type/size validation (NFR-SEC-05) ----
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Only JPG, PNG, and WEBP images are allowed", 422);
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBytes) {
      return errorResponse("Image must be smaller than 5MB", 422);
    }

    // ---- Convert file to Buffer ----
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ---- Upload to Cloudinary ----
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    // ---- Save to database (with isPrimary safeguard) ----
    const image = await prisma.$transaction(async (tx) => {
      if (isPrimary) {
        await tx.productImage.updateMany({
          where: { productId: product.id },
          data: { isPrimary: false },
        });
      }

      return tx.productImage.create({
        data: {
          productId: product.id,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          altText: altText || undefined,
          isPrimary,
          sortOrder,
        },
      });
    });

    return successResponse(image, 201);
  } catch (error) {
    console.error("POST product image error:", error);
    return errorResponse("Failed to upload image", 500);
  }
}
