-- CreateEnum
CREATE TYPE "BaleClothType" AS ENUM ('PUTIH', 'WARNA');

-- CreateEnum
CREATE TYPE "BaleGrade" AS ENUM ('A1', 'B2', 'C3');

-- CreateTable
CREATE TABLE "BalePrice" (
    "id" TEXT NOT NULL,
    "clothType" "BaleClothType" NOT NULL,
    "grade" "BaleGrade" NOT NULL,
    "pricePerBal" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BalePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BalePrice_clothType_idx" ON "BalePrice"("clothType");

-- CreateIndex
CREATE UNIQUE INDEX "BalePrice_clothType_grade_key" ON "BalePrice"("clothType", "grade");
