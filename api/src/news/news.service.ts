import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    priority?: string;
    published?: boolean;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params?.category) {
      where.category = params.category.toUpperCase();
    }
    if (params?.priority) {
      where.priority = params.priority.toUpperCase();
    }
    if (params?.published !== undefined) {
      where.isPublished = params.published;
    }

    const [news, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.news.count({ where }),
    ]);

    return {
      data: news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublished() {
    return this.prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.news.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException('News not found');
    }
    return news;
  }

  async incrementViewCount(id: string) {
    return this.prisma.news.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async create(data: {
    title: string;
    content: string;
    excerpt?: string;
    imageUrl?: string;
    category?: string;
    priority?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    createdBy?: string;
  }) {
    return this.prisma.news.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 200),
        imageUrl: data.imageUrl,
        category: (data.category?.toUpperCase() as any) || 'GENERAL',
        priority: (data.priority?.toUpperCase() as any) || 'MEDIUM',
        isPublished: data.isPublished || false,
        isFeatured: data.isFeatured || false,
        createdBy: data.createdBy,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    content: string;
    excerpt: string;
    imageUrl: string;
    category: string;
    priority: string;
    isPublished: boolean;
    isFeatured: boolean;
  }>) {
    const updateData: any = { ...data };
    if (data.category) updateData.category = data.category.toUpperCase();
    if (data.priority) updateData.priority = data.priority.toUpperCase();

    return this.prisma.news.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.news.delete({ where: { id } });
  }
}

