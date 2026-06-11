-- CreateEnum
CREATE TYPE "BongkaranStatus" AS ENUM ('PENDING_SORT', 'IN_PROGRESS', 'SORTED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Konveksi" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picName" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konveksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Konveksi_name_key" ON "Konveksi"("name");

-- CreateTable
CREATE TABLE "Bongkaran" (
    "id" TEXT NOT NULL,
    "konveksiId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "quantityKg" DECIMAL(12,2) NOT NULL,
    "pricePerKg" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "transportExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "additionalExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(14,2) NOT NULL,
    "costPerKgEffective" DECIMAL(14,4) NOT NULL,
    "sortedQuantityKg" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "BongkaranStatus" NOT NULL DEFAULT 'PENDING_SORT',
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bongkaran_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Bongkaran_konveksiId_idx" ON "Bongkaran"("konveksiId");
CREATE INDEX "Bongkaran_purchaseDate_idx" ON "Bongkaran"("purchaseDate");
CREATE INDEX "Bongkaran_status_idx" ON "Bongkaran"("status");

-- AddForeignKey
ALTER TABLE "Bongkaran" ADD CONSTRAINT "Bongkaran_konveksiId_fkey" FOREIGN KEY ("konveksiId") REFERENCES "Konveksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Bongkaran" ADD CONSTRAINT "Bongkaran_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "BongkaranSort" (
    "id" TEXT NOT NULL,
    "bongkaranId" TEXT NOT NULL,
    "sortDate" TIMESTAMP(3) NOT NULL,
    "inputKg" DECIMAL(12,2) NOT NULL,
    "outputPutihKg" DECIMAL(12,2) NOT NULL,
    "outputWarnaKg" DECIMAL(12,2) NOT NULL,
    "wasteKg" DECIMAL(12,2) NOT NULL,
    "laborExpense" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(14,2) NOT NULL,
    "unitCostPutih" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "unitCostWarna" DECIMAL(14,4) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BongkaranSort_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BongkaranSort_bongkaranId_idx" ON "BongkaranSort"("bongkaranId");
CREATE INDEX "BongkaranSort_sortDate_idx" ON "BongkaranSort"("sortDate");

-- AddForeignKey
ALTER TABLE "BongkaranSort" ADD CONSTRAINT "BongkaranSort_bongkaranId_fkey" FOREIGN KEY ("bongkaranId") REFERENCES "Bongkaran"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BongkaranSort" ADD CONSTRAINT "BongkaranSort_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
