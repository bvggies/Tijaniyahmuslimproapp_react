import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScholarsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    published?: boolean;
    search?: string;
  }) {
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      if (params?.published !== undefined) {
        where.isPublished = params.published;
      }
      // Only add search filter if search term is provided and not empty
      if (params?.search && params.search.trim().length > 0) {
        const searchTerm = params.search.trim();
        where.OR = [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { nameArabic: { contains: searchTerm, mode: 'insensitive' } },
          { title: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      const [scholars, total] = await Promise.all([
        this.prisma.scholar.findMany({
          where,
          skip,
          take: limit,
          orderBy: { sortOrder: 'asc' },
        }),
        this.prisma.scholar.count({ where }),
      ]);

      return {
        data: scholars,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Error in scholars service findAll:', error);
      console.error('Error details:', {
        code: error.code,
        meta: error.meta,
        message: error.message,
      });
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch scholars. Please check the server logs for details.'
      );
    }
  }

  async findPublished() {
    try {
      return await this.prisma.scholar.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      });
    } catch (error: any) {
      console.error('Error in scholars service findPublished:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to fetch published scholars.'
      );
    }
  }

  async findOne(id: string) {
    const scholar = await this.prisma.scholar.findUnique({ where: { id } });
    if (!scholar) {
      throw new NotFoundException('Scholar not found');
    }
    return scholar;
  }

  async create(data: {
    name: string;
    nameArabic?: string;
    title?: string;
    biography?: string;
    imageUrl?: string;
    birthYear?: number;
    deathYear?: number;
    location?: string;
    specialty?: string;
    isAlive?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
    createdBy?: string;
  }) {
    return this.prisma.scholar.create({
      data: {
        name: data.name,
        nameArabic: data.nameArabic,
        title: data.title,
        biography: data.biography,
        imageUrl: data.imageUrl,
        birthYear: data.birthYear,
        deathYear: data.deathYear,
        location: data.location,
        specialty: data.specialty,
        isAlive: data.isAlive !== undefined ? data.isAlive : true,
        isPublished: data.isPublished || false,
        sortOrder: data.sortOrder || 0,
        createdBy: data.createdBy,
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    nameArabic: string;
    title: string;
    biography: string;
    imageUrl: string;
    birthYear: number;
    deathYear: number;
    location: string;
    specialty: string;
    isAlive: boolean;
    isPublished: boolean;
    sortOrder: number;
  }>) {
    return this.prisma.scholar.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.scholar.delete({ where: { id } });
  }
}

