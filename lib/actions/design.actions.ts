"use server";

import cloudinary from "@/lib/cloudinary";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MIN_DIMENSION_PX = 500; // below this -> warning, not a hard block

type UploadDesignImageResult =
  | {
      success: true;
      data: {
        url: string;
        publicId: string;
        width: number;
        height: number;
        lowResolutionWarning: boolean;
      };
    }
  | {
      success: false;
      error: string;
    };

export async function uploadDesignImage(
  formData: FormData
): Promise<UploadDesignImageResult> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  // --- Validation: file type ---
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Only JPG and PNG images are allowed.",
    };
  }

  // --- Validation: file size ---
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: "Image size must be under 10MB.",
    };
  }

  try {
    // File -> base64 data URI (same pattern as Chat 4's ProductImage upload)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "designs",
    });

    const lowResolutionWarning =
      uploadResult.width < MIN_DIMENSION_PX || uploadResult.height < MIN_DIMENSION_PX;

    return {
      success: true,
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        lowResolutionWarning,
      },
    };
  } catch (error) {
    console.error("Cloudinary design upload failed:", error);
    return { success: false, error: "Upload failed. Please try again." };
  }
}

type OverlayPosition = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

type SaveDesignInput = {
  designId?: string; // agar diya gaya -> update, warna -> create
  productId: string;
  uploadedImageUrl?: string;
  uploadedImagePublicId?: string;
  textContent?: string;
  fontFamily?: string;
  textColor?: string;
  overlayPosition?: OverlayPosition;
};

type SaveDesignResult =
  { success: true; data: { designId: string } } | { success: false; error: string };

export async function saveDesign(input: SaveDesignInput): Promise<SaveDesignResult> {
  const { designId, productId } = input;

  // --- Validate product exists ---
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    return { success: false, error: "Invalid product." };
  }

  // --- Get logged-in user (if any) ---
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const designData = {
    productId,
    uploadedImageUrl: input.uploadedImageUrl,
    uploadedImagePublicId: input.uploadedImagePublicId,
    textContent: input.textContent,
    fontFamily: input.fontFamily,
    textColor: input.textColor,
    overlayPosition: input.overlayPosition,
  };

  try {
    if (designId) {
      // --- Update existing design ---
      const existing = await prisma.design.findUnique({
        where: { id: designId },
        select: { id: true, userId: true },
      });

      if (!existing) {
        return { success: false, error: "Design not found." };
      }

      // Agar design kisi logged-in user ka hai, sirf wahi user update kr sake
      if (existing.userId && existing.userId !== userId) {
        return { success: false, error: "Not authorized to edit this design." };
      }

      const updated = await prisma.design.update({
        where: { id: designId },
        data: designData,
      });

      return { success: true, data: { designId: updated.id } };
    } else {
      // --- Create new design ---
      const created = await prisma.design.create({
        data: {
          ...designData,
          userId,
        },
      });

      return { success: true, data: { designId: created.id } };
    }
  } catch (error) {
    console.error("Save design failed:", error);
    return { success: false, error: "Could not save design. Please try again." };
  }
}

export async function getDesign(designId: string) {
  const design = await prisma.design.findUnique({
    where: { id: designId },
  });

  if (!design) {
    return { success: false as const, error: "Design not found." };
  }

  return { success: true as const, data: design };
}

export async function deleteDesign(designId: string) {
  const design = await prisma.design.findUnique({
    where: { id: designId },
    select: { id: true, uploadedImagePublicId: true, previewImagePublicId: true },
  });

  if (!design) {
    return { success: false as const, error: "Design not found." };
  }

  try {
    // Cloudinary cleanup — dono images agar mojood hon
    if (design.uploadedImagePublicId) {
      await cloudinary.uploader.destroy(design.uploadedImagePublicId);
    }
    if (design.previewImagePublicId) {
      await cloudinary.uploader.destroy(design.previewImagePublicId);
    }

    await prisma.design.delete({ where: { id: designId } });

    return { success: true as const };
  } catch (error) {
    console.error("Delete design failed:", error);
    return { success: false as const, error: "Could not delete design." };
  }
}

type SavePreviewSnapshotResult =
  | { success: true; data: { previewImageUrl: string } }
  | { success: false; error: string };

export async function savePreviewSnapshot(
  designId: string,
  dataUri: string // e.g. "data:image/png;base64,...."
): Promise<SavePreviewSnapshotResult> {
  if (!dataUri.startsWith("data:image/")) {
    return { success: false, error: "Invalid image data." };
  }

  const design = await prisma.design.findUnique({
    where: { id: designId },
    select: { id: true, previewImagePublicId: true },
  });

  if (!design) {
    return { success: false, error: "Design not found." };
  }

  try {
    // Purani preview image (agar hai) cleanup — regenerate ka case
    if (design.previewImagePublicId) {
      await cloudinary.uploader.destroy(design.previewImagePublicId);
    }

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "design-previews",
    });

    await prisma.design.update({
      where: { id: designId },
      data: {
        previewImageUrl: uploadResult.secure_url,
        previewImagePublicId: uploadResult.public_id,
      },
    });

    return { success: true, data: { previewImageUrl: uploadResult.secure_url } };
  } catch (error) {
    console.error("Save preview snapshot failed:", error);
    return { success: false, error: "Could not save preview snapshot." };
  }
}
