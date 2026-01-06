import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      // Handle category filter - now supports any category name (dynamic)
      if (params?.category && params.category.trim()) {
        where.category = params.category.trim();
      }
      
      // Handle priority filter with validation
      if (params?.priority && params.priority.trim()) {
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        const priorityUpper = params.priority.toUpperCase().trim();
        if (validPriorities.includes(priorityUpper)) {
          where.priority = priorityUpper;
        }
      }
      
      // Handle published filter
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

      console.log(`[NewsService] Found ${news.length} articles (total: ${total}) with filters:`, where);

      return {
        data: news,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Error in news service findAll:', error);
      console.error('Error details:', {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
      
      // Handle Prisma errors
      if (error.code === 'P2001') {
        throw new NotFoundException('Record not found');
      }
      
      // Re-throw NestJS exceptions as-is
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Wrap other errors
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch news articles. Please check the server logs for details.'
      );
    }
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
    try {
      // Validate required fields
      if (!data.title || !data.title.trim()) {
        throw new BadRequestException('Title is required');
      }
      if (!data.content || !data.content.trim()) {
        throw new BadRequestException('Content is required');
      }

      // Validate category - check if it exists in NewsCategory table
      const categoryName = data.category?.toUpperCase().trim() || 'GENERAL';
      
      // Check if category exists (optional validation - can be removed if you want to allow any category)
      const categoryExists = await this.prisma.newsCategory.findUnique({
        where: { name: categoryName },
      });
      
      if (!categoryExists) {
        // If category doesn't exist, create it automatically or use default
        console.warn(`[NewsService] Category "${categoryName}" not found, using as-is`);
      }

      // Validate priority enum
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
      const priority = data.priority?.toUpperCase() || 'MEDIUM';
      if (!validPriorities.includes(priority)) {
        throw new BadRequestException(`Invalid priority: ${priority}. Must be one of: ${validPriorities.join(', ')}`);
      }

      // Generate excerpt if not provided
      const excerpt = data.excerpt?.trim() || data.content.trim().substring(0, 200);

      const createdArticle = await this.prisma.news.create({
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
          excerpt: excerpt,
          imageUrl: data.imageUrl?.trim() || null,
          category: categoryName,
          priority: priority as any,
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
          createdBy: data.createdBy || null,
        },
      });

      console.log('[NewsService] Article created successfully:', {
        id: createdArticle.id,
        title: createdArticle.title,
        isPublished: createdArticle.isPublished,
        createdAt: createdArticle.createdAt,
      });

      return createdArticle;
    } catch (error: any) {
      console.error('Error in news service create:', error);
      console.error('Error details:', {
        code: error.code,
        meta: error.meta,
        message: error.message,
        stack: error.stack,
      });
      
      // Handle Prisma errors
      if (error.code === 'P2002') {
        throw new BadRequestException('A record with this information already exists');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid reference: ' + (error.meta?.field_name || 'unknown field'));
      }
      
      // Handle missing column errors
      if (error.message && error.message.includes('does not exist')) {
        const columnMatch = error.message.match(/column ['"]([^'"]+)['"]/i);
        const columnName = columnMatch ? columnMatch[1] : (error.meta?.target?.[0] || 'unknown');
        console.error('[NewsService] Database column error:', {
          message: error.message,
          meta: error.meta,
          columnName,
        });
        throw new BadRequestException(
          `Database column '${columnName}' does not exist. Please run database migrations to add missing columns.`
        );
      }
      
      // Re-throw NestJS exceptions as-is
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Wrap other errors
      throw new InternalServerErrorException(
        error.message || 'Failed to create news article. Please check the server logs for details.'
      );
    }
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

