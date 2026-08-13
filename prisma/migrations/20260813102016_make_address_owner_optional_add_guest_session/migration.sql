-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "guestSessionId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "addresses_guestSessionId_idx" ON "addresses"("guestSessionId");
