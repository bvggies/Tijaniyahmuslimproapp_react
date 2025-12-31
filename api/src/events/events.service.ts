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
    return this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        imageUrl: data.imageUrl,
        category: (data.category?.toUpperCase() as any) || 'OTHER',
        status: (data.status?.toUpperCase() as any) || 'UPCOMING',
        isPublished: data.isPublished || false,
        maxAttendees: data.maxAttendees,
        registrationRequired: data.registrationRequired || false,
        createdBy: data.createdBy,
      },
    });
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

