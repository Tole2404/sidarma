-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "preferredBalePriceId" TEXT;

-- CreateIndex
CREATE INDEX "Customer_preferredBalePriceId_idx" ON "Customer"("preferredBalePriceId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_preferredBalePriceId_fkey" FOREIGN KEY ("preferredBalePriceId") REFERENCES "BalePrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
