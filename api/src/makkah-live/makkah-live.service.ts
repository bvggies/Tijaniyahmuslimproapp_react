import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, ChannelQueryDto, ChannelType, ChannelCategory } from './dto/channel.dto';

@Injectable()
export class MakkahLiveService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all channels with optional filtering
   */
  async getChannels(query: ChannelQueryDto = {}) {
    const { type, category, activeOnly = true, featuredOnly = false } = query;

    const where: any = {};
    
    if (activeOnly) {
      where.isActive = true;
    }
    
    if (featuredOnly) {
      where.isFeatured = true;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (category) {
      where.category = category;
    }

    return this.prisma.makkahLiveChannel.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get all channels for admin (including inactive)
   */
  async getAllChannelsAdmin() {
    return this.prisma.makkahLiveChannel.findMany({
      orderBy: [
        { type: 'asc' },
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });
  }

  /**
   * Get a single channel by ID
   */
  async getChannelById(id: string) {
    const channel = await this.prisma.makkahLiveChannel.findUnique({
      where: { id },
    });

    if (!channel) {
      throw new NotFoundException(`Channel with ID ${id} not found`);
    }

    return channel;
  }

  /**
   * Create a new channel (Admin only)
   */
  async createChannel(dto: CreateChannelDto, adminUserId?: string) {
    return this.prisma.makkahLiveChannel.create({
      data: {
        title: dto.title,
        titleArabic: dto.titleArabic,
        subtitle: dto.subtitle,
        type: dto.type,
        category: dto.category,
        youtubeId: dto.youtubeId,
        websiteUrl: dto.websiteUrl,
        logo: dto.logo,
        thumbnailUrl: dto.thumbnailUrl,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
        createdBy: adminUserId,
      },
    });
  }

  /**
   * Update a channel (Admin only)
   */
  async updateChannel(id: string, dto: UpdateChannelDto) {
    // Check if channel exists
    await this.getChannelById(id);

    return this.prisma.makkahLiveChannel.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a channel (Admin only)
   */
  async deleteChannel(id: string) {
    // Check if channel exists
    await this.getChannelById(id);

    return this.prisma.makkahLiveChannel.delete({
      where: { id },
    });
  }

  /**
   * Toggle channel active status (Admin only)
   */
  async toggleChannelStatus(id: string) {
    const channel = await this.getChannelById(id);

    return this.prisma.makkahLiveChannel.update({
      where: { id },
      data: { isActive: !channel.isActive },
    });
  }

  /**
   * Toggle channel featured status (Admin only)
   */
  async toggleChannelFeatured(id: string) {
    const channel = await this.getChannelById(id);

    return this.prisma.makkahLiveChannel.update({
      where: { id },
      data: { isFeatured: !channel.isFeatured },
    });
  }

  /**
   * Reorder channels (Admin only)
   */
  async reorderChannels(channelOrders: { id: string; sortOrder: number }[]) {
    const updates = channelOrders.map(({ id, sortOrder }) =>
      this.prisma.makkahLiveChannel.update({
        where: { id },
        data: { sortOrder },
      })
    );

    return this.prisma.$transaction(updates);
  }

  /**
   * Seed default channels if none exist
   */
  async seedDefaultChannels() {
    const count = await this.prisma.makkahLiveChannel.count();
    
    if (count > 0) {
      return { message: 'Channels already exist', count };
    }

    const defaultChannels = [
      // YouTube Live Streams
      {
        title: '🕋 Makkah Live Stream 1',
        titleArabic: 'بث مكة المباشر ١',
        subtitle: 'Live streaming from the Holy Kaaba',
        type: ChannelType.YOUTUBE_LIVE,
        category: ChannelCategory.MAKKAH,
        youtubeId: '6F84NXOUCdw',
        sortOrder: 1,
        isFeatured: true,
      },
      {
        title: '🕋 Makkah Live Stream 2',
        titleArabic: 'بث مكة المباشر ٢',
        subtitle: 'Live streaming from the Holy Kaaba',
        type: ChannelType.YOUTUBE_LIVE,
        category: ChannelCategory.MAKKAH,
        youtubeId: 'U6bEFxYWJlo',
        sortOrder: 2,
        isFeatured: true,
      },
      // TV Channels
      {
        title: '📺 Quran TV Saudi Arabia',
        titleArabic: 'قناة القرآن الكريم',
        subtitle: 'Official Saudi Quran TV Channel',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.QURAN,
        websiteUrl: 'https://qurantv.sa',
        logo: '📺',
        sortOrder: 10,
      },
      {
        title: '📺 Iqra TV',
        titleArabic: 'قناة اقرأ',
        subtitle: 'International Islamic TV Network',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.ISLAMIC,
        websiteUrl: 'https://iqra.tv',
        logo: '📺',
        sortOrder: 11,
      },
      {
        title: '📺 Al Majd Quran',
        titleArabic: 'قناة المجد للقرآن',
        subtitle: 'Quran recitation and Islamic content',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.QURAN,
        websiteUrl: 'https://almajd.tv',
        logo: '📺',
        sortOrder: 12,
      },
      {
        title: '📺 Peace TV',
        titleArabic: 'قناة السلام',
        subtitle: 'Global Islamic television network',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.ISLAMIC,
        websiteUrl: 'https://peacetv.tv',
        logo: '📺',
        sortOrder: 13,
      },
      {
        title: '📺 Islam Channel',
        titleArabic: 'قناة الإسلام',
        subtitle: 'UK-based Islamic television',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.ISLAMIC,
        websiteUrl: 'https://islamchannel.tv',
        logo: '📺',
        sortOrder: 14,
      },
      {
        title: '📺 Huda TV',
        titleArabic: 'قناة الهدى',
        subtitle: 'Islamic satellite television',
        type: ChannelType.TV_CHANNEL,
        category: ChannelCategory.ISLAMIC,
        websiteUrl: 'https://hudatv.net',
        logo: '📺',
        sortOrder: 15,
      },
    ];

    await this.prisma.makkahLiveChannel.createMany({
      data: defaultChannels.map(ch => ({
        ...ch,
        isActive: true,
        isFeatured: ch.isFeatured ?? false,
      })),
    });

    return { message: 'Default channels seeded', count: defaultChannels.length };
  }
}

