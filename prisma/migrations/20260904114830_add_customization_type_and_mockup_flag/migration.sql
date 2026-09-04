-- CreateEnum
CREATE TYPE "CustomizationType" AS ENUM ('IMAGE_ONLY', 'TEXT_ONLY', 'BOTH');

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "isMockup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "customizationType" "CustomizationType";
