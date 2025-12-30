import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateLastReadDto } from './dto/bookmark.dto';

@Injectable()
export class QuranService {
  private readonly logger = new Logger(QuranService.name);

  constructor(private prisma: PrismaService) {}

  // ============================================
  // BOOKMARKS
  // ============================================

  async getBookmarks(userId: string) {
    return this.prisma.quranBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createBookmark(userId: string, dto: CreateBookmarkDto) {
    // Check if bookmark already exists
    const existing = await this.prisma.quranBookmark.findUnique({
      where: {
        userId_verseKey: {
          userId,
          verseKey: dto.verseKey,
        },
      },
    });

    if (existing) {
      // Update existing bookmark
      return this.prisma.quranBookmark.update({
        where: { id: existing.id },
        data: { note: dto.note },
      });
    }

    // Create new bookmark
    return this.prisma.quranBookmark.create({
      data: {
        userId,
        verseKey: dto.verseKey,
        chapterId: dto.chapterId,
        verseNumber: dto.verseNumber,
        note: dto.note,
      },
    });
  }

  async deleteBookmark(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.quranBookmark.findFirst({
      where: { id: bookmarkId, userId },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.quranBookmark.delete({
      where: { id: bookmarkId },
    });

    return { success: true };
  }

  async deleteBookmarkByVerseKey(userId: string, verseKey: string) {
    const bookmark = await this.prisma.quranBookmark.findUnique({
      where: {
        userId_verseKey: { userId, verseKey },
      },
    });

    if (!bookmark) {
      throw new NotFoundException('Bookmark not found');
    }

    await this.prisma.quranBookmark.delete({
      where: { id: bookmark.id },
    });

    return { success: true };
  }

  // ============================================
  // LAST READ
  // ============================================

  async getLastRead(userId: string) {
    return this.prisma.quranLastRead.findUnique({
      where: { userId },
    });
  }

  async updateLastRead(userId: string, dto: UpdateLastReadDto) {
    return this.prisma.quranLastRead.upsert({
      where: { userId },
      update: {
        chapterId: dto.chapterId,
        verseNumber: dto.verseNumber,
        verseKey: dto.verseKey,
        scrollPosition: dto.scrollPosition,
      },
      create: {
        userId,
        chapterId: dto.chapterId,
        verseNumber: dto.verseNumber,
        verseKey: dto.verseKey,
        scrollPosition: dto.scrollPosition,
      },
    });
  }

  // ============================================
  // READING PREFERENCES
  // ============================================

  async getReadingPreferences(userId: string) {
    return this.prisma.quranReadingPreferences.findUnique({
      where: { userId },
    });
  }

  async updateReadingPreferences(
    userId: string,
    data: {
      translationId?: number;
      arabicFontSize?: number;
      translationFontSize?: number;
      showTransliteration?: boolean;
      theme?: string;
    },
  ) {
    return this.prisma.quranReadingPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }
}

