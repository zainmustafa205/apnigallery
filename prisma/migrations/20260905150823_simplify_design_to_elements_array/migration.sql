/*
  Warnings:

  - You are about to drop the column `fontFamily` on the `designs` table. All the data in the column will be lost.
  - You are about to drop the column `overlayPosition` on the `designs` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `designs` table. All the data in the column will be lost.
  - You are about to drop the column `textContent` on the `designs` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedImagePublicId` on the `designs` table. All the data in the column will be lost.
  - You are about to drop the column `uploadedImageUrl` on the `designs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "designs" DROP COLUMN "fontFamily",
DROP COLUMN "overlayPosition",
DROP COLUMN "textColor",
DROP COLUMN "textContent",
DROP COLUMN "uploadedImagePublicId",
DROP COLUMN "uploadedImageUrl",
ADD COLUMN     "elements" JSONB;
