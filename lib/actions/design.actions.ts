"use server";

import cloudinary from "@/lib/cloudinary";

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
