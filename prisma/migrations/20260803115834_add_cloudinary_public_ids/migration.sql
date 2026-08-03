-- AlterTable
ALTER TABLE "designs" ADD COLUMN     "previewImagePublicId" TEXT,
ADD COLUMN     "uploadedImagePublicId" TEXT;

-- AlterTable
ALTER TABLE "gallery_items" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "hero_banners" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "screenshotPublicId" TEXT;

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "imagePublicId" TEXT;
