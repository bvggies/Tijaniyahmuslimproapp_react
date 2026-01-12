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
    try {
      // Only include fields that are provided (don't send undefined)
      const createData: any = {
        name: data.name,
        isAlive: data.isAlive !== undefined ? data.isAlive : true,
        isPublished: data.isPublished || false,
        sortOrder: data.sortOrder || 0,
      };

      // Only add optional fields if they have values
      if (data.nameArabic !== undefined && data.nameArabic !== null && data.nameArabic !== '') {
        createData.nameArabic = data.nameArabic;
      }
      if (data.title !== undefined && data.title !== null && data.title !== '') {
        createData.title = data.title;
      }
      if (data.biography !== undefined && data.biography !== null && data.biography !== '') {
        createData.biography = data.biography;
      }
      if (data.imageUrl !== undefined && data.imageUrl !== null && data.imageUrl !== '') {
        createData.imageUrl = data.imageUrl;
      }
      if (data.birthYear !== undefined && data.birthYear !== null) {
        createData.birthYear = data.birthYear;
      }
      if (data.deathYear !== undefined && data.deathYear !== null) {
        createData.deathYear = data.deathYear;
      }
      if (data.location !== undefined && data.location !== null && data.location !== '') {
        createData.location = data.location;
      }
      if (data.specialty !== undefined && data.specialty !== null && data.specialty !== '') {
        createData.specialty = data.specialty;
      }
      if (data.createdBy !== undefined && data.createdBy !== null) {
        createData.createdBy = data.createdBy;
      }

      return await this.prisma.scholar.create({
        data: createData,
      });
    } catch (error: any) {
      console.error('Error creating scholar:', error);
      console.error('Error details:', {
        code: error.code,
        meta: error.meta,
        message: error.message,
        data: data,
      });
      
      // Provide more helpful error message for schema mismatch
      if (error.code === 'P2011' && error.meta?.constraint?.includes('bio')) {
        throw new InternalServerErrorException(
          'Database schema error: The bio column still exists in the database. ' +
          'Please ensure migrations have been run successfully. ' +
          'The migration should rename "bio" to "biography" and make it nullable.'
        );
      }
      
      throw new InternalServerErrorException(
        error.message || 'Failed to create scholar. Please check the server logs for details.'
      );
    }
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

