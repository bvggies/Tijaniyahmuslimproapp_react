-- CreateTable
CREATE TABLE "AzanSchedule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "muezzin" TEXT,
    "location" TEXT,
    "description" TEXT,
    "audioUrl" TEXT NOT NULL,
    "playAt" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AzanSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AzanSchedule_isActive_idx" ON "AzanSchedule"("isActive");

-- CreateIndex
CREATE INDEX "AzanSchedule_sortOrder_idx" ON "AzanSchedule"("sortOrder");
