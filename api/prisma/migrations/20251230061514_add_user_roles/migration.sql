-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'SCHOLAR', 'SUPPORT', 'VIEWER');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('YOUTUBE_LIVE', 'TV_CHANNEL');

-- CreateEnum
CREATE TYPE "ChannelCategory" AS ENUM ('MAKKAH', 'MADINAH', 'QURAN', 'ISLAMIC', 'NEWS', 'EDUCATIONAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "MakkahLiveChannel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleArabic" TEXT,
    "subtitle" TEXT,
    "type" "ChannelType" NOT NULL,
    "category" "ChannelCategory" NOT NULL,
    "youtubeId" TEXT,
    "websiteUrl" TEXT,
    "logo" TEXT,
    "thumbnailUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MakkahLiveChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MakkahLiveChannel_type_isActive_idx" ON "MakkahLiveChannel"("type", "isActive");

-- CreateIndex
CREATE INDEX "MakkahLiveChannel_category_isActive_idx" ON "MakkahLiveChannel"("category", "isActive");

-- CreateIndex
CREATE INDEX "MakkahLiveChannel_sortOrder_idx" ON "MakkahLiveChannel"("sortOrder");
