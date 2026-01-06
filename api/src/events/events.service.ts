import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    published?: boolean;
  }) {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (params?.category) {
      where.category = params.category.toUpperCase();
    }
    if (params?.status) {
      where.status = params.status.toUpperCase();
    }
    if (params?.published !== undefined) {
      where.isPublished = params.published;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublished() {
    return this.prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: 'asc' },
    });
  }

  async findUpcoming() {
    return this.prisma.event.findMany({
      where: {
        isPublished: true,
        startDate: { gte: new Date() },
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
      orderBy: { startDate: 'asc' },
      take: 10,
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async create(data: {
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    imageUrl?: string;
    category?: string;
    status?: string;
    isPublished?: boolean;
    maxAttendees?: number;
    registrationRequired?: boolean;
    createdBy?: string;
  }) {
    try {
      // Validate category enum
      const validCategories = ['CONFERENCE', 'SEMINAR', 'WORKSHOP', 'CELEBRATION', 'OTHER'];
      const category = data.category?.toUpperCase() || 'OTHER';
      if (!validCategories.includes(category)) {
        throw new Error(`Invalid category: ${category}. Must be one of: ${validCategories.join(', ')}`);
      }

      // Validate status enum
      const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
      const status = data.status?.toUpperCase() || 'UPCOMING';
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
      }

      return await this.prisma.event.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          location: data.location.trim(),
          startDate: data.startDate,
          endDate: data.endDate,
          imageUrl: data.imageUrl?.trim() || null,
          category: category as any,
          status: status as any,
          isPublished: data.isPublished || false,
          maxAttendees: data.maxAttendees || null,
          registrationRequired: data.registrationRequired || false,
          createdBy: data.createdBy || null,
        },
      });
    } catch (error: any) {
      console.error('Error in events service create:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<{
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date;
    imageUrl: string;
    category: string;
    status: string;
    isPublished: boolean;
    maxAttendees: number;
    registrationRequired: boolean;
  }>) {
    const updateData: any = { ...data };
    if (data.category) updateData.category = data.category.toUpperCase();
    if (data.status) updateData.status = data.status.toUpperCase();

    return this.prisma.event.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}

