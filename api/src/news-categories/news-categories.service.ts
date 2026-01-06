import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsCategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly?: boolean) {
    try {
      const where: any = {};
      if (activeOnly !== undefined) {
        where.isActive = activeOnly;
      }

      const categories = await this.prisma.newsCategory.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      });

      return categories;
    } catch (error: any) {
      console.error('Error in news categories service findAll:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch news categories'
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.newsCategory.findUnique({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException('News category not found');
      }

      return category;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error in news categories service findOne:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch news category'
      );
    }
  }

  async create(data: {
    name: string;
    nameArabic?: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    try {
      // Validate required fields
      if (!data.name || !data.name.trim()) {
        throw new BadRequestException('Category name is required');
      }

      // Check if category with same name already exists
      const existing = await this.prisma.newsCategory.findUnique({
        where: { name: data.name.trim().toUpperCase() },
      });

      if (existing) {
        throw new BadRequestException(`Category with name "${data.name}" already exists`);
      }

      const category = await this.prisma.newsCategory.create({
        data: {
          name: data.name.trim().toUpperCase(),
          nameArabic: data.nameArabic?.trim() || null,
          description: data.description?.trim() || null,
          color: data.color?.trim() || null,
          icon: data.icon?.trim() || null,
          isActive: data.isActive !== undefined ? data.isActive : true,
          sortOrder: data.sortOrder || 0,
        },
      });

      console.log('[NewsCategoriesService] Category created:', category.id);
      return category;
    } catch (error: any) {
      console.error('Error in news categories service create:', error);
      
      if (error.code === 'P2002') {
        throw new BadRequestException('A category with this name already exists');
      }
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        error.message || 'Failed to create news category'
      );
    }
  }

  async update(id: string, data: {
    name?: string;
    nameArabic?: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) {
    try {
      // Check if category exists
      const existing = await this.prisma.newsCategory.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('News category not found');
      }

      // If name is being updated, check for duplicates
      if (data.name && data.name.trim() !== existing.name) {
        const duplicate = await this.prisma.newsCategory.findUnique({
          where: { name: data.name.trim().toUpperCase() },
        });

        if (duplicate) {
          throw new BadRequestException(`Category with name "${data.name}" already exists`);
        }
      }

      const updateData: any = {};
      if (data.name !== undefined) updateData.name = data.name.trim().toUpperCase();
      if (data.nameArabic !== undefined) updateData.nameArabic = data.nameArabic?.trim() || null;
      if (data.description !== undefined) updateData.description = data.description?.trim() || null;
      if (data.color !== undefined) updateData.color = data.color?.trim() || null;
      if (data.icon !== undefined) updateData.icon = data.icon?.trim() || null;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

      const category = await this.prisma.newsCategory.update({
        where: { id },
        data: updateData,
      });

      console.log('[NewsCategoriesService] Category updated:', category.id);
      return category;
    } catch (error: any) {
      console.error('Error in news categories service update:', error);
      
      if (error.code === 'P2002') {
        throw new BadRequestException('A category with this name already exists');
      }
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        error.message || 'Failed to update news category'
      );
    }
  }

  async delete(id: string) {
    try {
      // Check if category exists
      const existing = await this.prisma.newsCategory.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('News category not found');
      }

      // Check if any news articles are using this category
      const newsCount = await this.prisma.news.count({
        where: { category: existing.name },
      });

      if (newsCount > 0) {
        throw new BadRequestException(
          `Cannot delete category. ${newsCount} news article(s) are using this category. Please reassign them first.`
        );
      }

      await this.prisma.newsCategory.delete({
        where: { id },
      });

      console.log('[NewsCategoriesService] Category deleted:', id);
      return { success: true, message: 'Category deleted successfully' };
    } catch (error: any) {
      console.error('Error in news categories service delete:', error);
      
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(
        error.message || 'Failed to delete news category'
      );
    }
  }
}

