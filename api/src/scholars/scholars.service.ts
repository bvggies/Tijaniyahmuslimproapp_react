import { Injectable, NotFoundException } from '@nestjs/common';
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
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params?.published !== undefined) {
      where.isPublished = params.published;
    }
    if (params?.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { nameArabic: { contains: params.search, mode: 'insensitive' } },
        { title: { contains: params.search, mode: 'insensitive' } },
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
  }

  async findPublished() {
    return this.prisma.scholar.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
    });
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

