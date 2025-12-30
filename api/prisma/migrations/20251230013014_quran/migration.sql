-- CreateTable
CREATE TABLE "QuranBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verseKey" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuranBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranLastRead" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterId" INTEGER NOT NULL,
    "verseNumber" INTEGER NOT NULL,
    "verseKey" TEXT NOT NULL,
    "scrollPosition" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuranLastRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuranReadingPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "translationId" INTEGER NOT NULL DEFAULT 131,
    "arabicFontSize" INTEGER NOT NULL DEFAULT 28,
    "translationFontSize" INTEGER NOT NULL DEFAULT 16,
    "showTransliteration" BOOLEAN NOT NULL DEFAULT false,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuranReadingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuranBookmark_userId_createdAt_idx" ON "QuranBookmark"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "QuranBookmark_chapterId_idx" ON "QuranBookmark"("chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "QuranBookmark_userId_verseKey_key" ON "QuranBookmark"("userId", "verseKey");

-- CreateIndex
CREATE UNIQUE INDEX "QuranLastRead_userId_key" ON "QuranLastRead"("userId");

-- CreateIndex
CREATE INDEX "QuranLastRead_userId_idx" ON "QuranLastRead"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuranReadingPreferences_userId_key" ON "QuranReadingPreferences"("userId");

-- CreateIndex
CREATE INDEX "QuranReadingPreferences_userId_idx" ON "QuranReadingPreferences"("userId");

-- AddForeignKey
ALTER TABLE "QuranBookmark" ADD CONSTRAINT "QuranBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuranLastRead" ADD CONSTRAINT "QuranLastRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuranReadingPreferences" ADD CONSTRAINT "QuranReadingPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
