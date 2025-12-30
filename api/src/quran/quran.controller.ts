import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuranService } from './quran.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { CreateBookmarkDto, UpdateLastReadDto } from './dto/bookmark.dto';

@Controller('quran')
export class QuranController {
  constructor(private quranService: QuranService) {}

  // ============================================
  // BOOKMARKS
  // ============================================

  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  async getBookmarks(@Req() req: any) {
    const userId = req.user.userId;
    const bookmarks = await this.quranService.getBookmarks(userId);
    return { bookmarks };
  }

  @Post('bookmarks')
  @UseGuards(JwtAuthGuard)
  async createBookmark(@Req() req: any, @Body() dto: CreateBookmarkDto) {
    const userId = req.user.userId;
    const bookmark = await this.quranService.createBookmark(userId, dto);
    return { bookmark };
  }

  @Delete('bookmarks/:id')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.userId;
    return this.quranService.deleteBookmark(userId, id);
  }

  @Delete('bookmarks/verse/:verseKey')
  @UseGuards(JwtAuthGuard)
  async deleteBookmarkByVerse(
    @Req() req: any,
    @Param('verseKey') verseKey: string,
  ) {
    const userId = req.user.userId;
    return this.quranService.deleteBookmarkByVerseKey(userId, verseKey);
  }

  // ============================================
  // LAST READ
  // ============================================

  @Get('last-read')
  @UseGuards(JwtAuthGuard)
  async getLastRead(@Req() req: any) {
    const userId = req.user.userId;
    const lastRead = await this.quranService.getLastRead(userId);
    return { lastRead };
  }

  @Put('last-read')
  @UseGuards(JwtAuthGuard)
  async updateLastRead(@Req() req: any, @Body() dto: UpdateLastReadDto) {
    const userId = req.user.userId;
    const lastRead = await this.quranService.updateLastRead(userId, dto);
    return { lastRead };
  }

  // ============================================
  // READING PREFERENCES
  // ============================================

  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getPreferences(@Req() req: any) {
    const userId = req.user.userId;
    const preferences = await this.quranService.getReadingPreferences(userId);
    return { preferences };
  }

  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  async updatePreferences(
    @Req() req: any,
    @Body()
    body: {
      translationId?: number;
      arabicFontSize?: number;
      translationFontSize?: number;
      showTransliteration?: boolean;
      theme?: string;
    },
  ) {
    const userId = req.user.userId;
    const preferences = await this.quranService.updateReadingPreferences(
      userId,
      body,
    );
    return { preferences };
  }
}

