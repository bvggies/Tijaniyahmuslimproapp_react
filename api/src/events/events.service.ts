import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    search?: string;
  }) {
    try {
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const skip = (page - 1) * limit;

      const where: any = {};
      
      // Handle category filter with validation
      if (params?.category && params.category.trim()) {
        const validCategories = ['CONFERENCE', 'SEMINAR', 'WORKSHOP', 'CELEBRATION', 'PRAYER', 'OTHER'];
        const categoryUpper = params.category.toUpperCase().trim();
        if (validCategories.includes(categoryUpper)) {
          where.category = categoryUpper;
        }
      }
      
      // Handle status filter with validation
      if (params?.status && params.status.trim()) {
        const validStatuses = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];
        const statusUpper = params.status.toUpperCase().trim();
        if (validStatuses.includes(statusUpper)) {
          where.status = statusUpper;
        }
      }
      
      // Handle published filter
      if (params?.published !== undefined) {
        where.isPublished = params.published;
      }

      // Handle search filter - only add if search term is not empty
      if (params?.search && typeof params.search === 'string' && params.search.trim().length > 0) {
        const searchTerm = params.search.trim();
        where.OR = [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
        ];
      }

      const [events, total] = await Promise.all([
        this.prisma.event.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }, // Show newest first
        }),
        this.prisma.event.count({ where }),
      ]);

      console.log(`[EventsService] Found ${events.length} events (total: ${total}) with filters:`, where);

      return {
        data: events,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error('Error in events service findAll:', error);
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
        error.message || 'Failed to fetch events. Please check the server logs for details.'
      );
    }
  }

  async findPublished() {
    try {
      // Use a timeout to prevent hanging queries
      const queryPromise = this.prisma.event.findMany({
        where: { 
          isPublished: true,
        },
        orderBy: { 
          startDate: 'asc' 
        },
        take: 1000, // Limit to prevent performance issues
      });

      // Add a timeout of 10 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), 10000);
      });

      const events = await Promise.race([queryPromise, timeoutPromise]) as any[];
      
      // Return empty array if no events found (not an error)
      return Array.isArray(events) ? events : [];
    } catch (error: any) {
      // Log error for debugging
      console.error('Error in events service findPublished:', {
        code: error.code,
        message: error.message,
        name: error.name,
        meta: error.meta,
      });
      
      // Always return empty array to prevent app crash
      // This ensures the API always returns a valid response
      return [];
    }
  }

  async findUpcoming() {
    try {
      // Get current date at start of day for accurate comparison
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      const events = await this.prisma.event.findMany({
        where: {
          isPublished: true,
          OR: [
            { startDate: { gte: now } },
            {
              AND: [
                { startDate: { lte: now } },
                { endDate: { gte: now } },
                { status: { in: ['UPCOMING', 'ONGOING'] as any } },
              ],
            },
          ],
        },
        orderBy: { startDate: 'asc' },
        take: 10,
      });
      
      // Return empty array if no events found (not an error)
      return events || [];
    } catch (error: any) {
      // Log error for debugging
      console.error('Error in events service findUpcoming:', {
        code: error.code,
        message: error.message,
        name: error.name,
        meta: error.meta,
      });
      
      // Always return empty array to prevent app crash
      // This ensures the API always returns a valid response
      return [];
    }
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
    // Build data object with only valid fields (moved outside try for error logging)
    let eventData: any = null;
    
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

      // Build data object with only valid fields
      eventData = {
        title: data.title.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
        startDate: data.startDate,
        endDate: data.endDate,
        category: category as any,
        status: status as any,
        isPublished: data.isPublished || false,
      };

      // Only include optional fields if they have values
      if (data.imageUrl && data.imageUrl.trim()) {
        eventData.imageUrl = data.imageUrl.trim();
      }

      if (data.maxAttendees !== undefined && data.maxAttendees !== null) {
        eventData.maxAttendees = data.maxAttendees;
      }

      if (data.registrationRequired !== undefined) {
        eventData.registrationRequired = data.registrationRequired;
      }

      if (data.createdBy) {
        eventData.createdBy = data.createdBy;
      }

      const createdEvent = await this.prisma.event.create({
        data: eventData,
      });
      
      console.log('[EventsService] Event created successfully:', {
        id: createdEvent.id,
        title: createdEvent.title,
        isPublished: createdEvent.isPublished,
        createdAt: createdEvent.createdAt,
      });
      
      return createdEvent;
    } catch (error: any) {
      console.error('Error in events service create:', error);
      console.error('Error details:', {
        code: error.code,
        meta: error.meta,
        message: error.message,
        stack: error.stack,
      });
      if (eventData) {
        console.error('Event data attempted:', JSON.stringify(eventData, null, 2));
      }
      
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
        const columnName = columnMatch ? columnMatch[1] : 'unknown';
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
        error.message || 'Failed to create event. Please check the server logs for details.'
      );
    }
  }

  async update(id: string, data: any) {
    try {
      // Only allow fields that exist on Event model (strip tags, id, createdAt, updatedAt, etc.)
      const allowedKeys = [
        'title', 'description', 'location', 'startDate', 'endDate', 'imageUrl',
        'category', 'status', 'isPublished', 'maxAttendees', 'registrationRequired',
      ];
      const updateData: any = {};
      for (const key of allowedKeys) {
        if (data[key] !== undefined) {
          if (key === 'startDate' || key === 'endDate') {
            const d = data[key] instanceof Date ? data[key] : new Date(data[key]);
            if (isNaN(d.getTime())) {
              throw new BadRequestException(`Invalid ${key} value`);
            }
            updateData[key] = d;
          } else if (key === 'category' && typeof data[key] === 'string') {
            updateData[key] = data[key].toUpperCase();
          } else if (key === 'status' && typeof data[key] === 'string') {
            updateData[key] = data[key].toUpperCase();
          } else {
            updateData[key] = data[key];
          }
        }
      }
      if (Object.keys(updateData).length === 0) {
        return this.findOne(id);
      }
      return await this.prisma.event.update({
        where: { id },
        data: updateData,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Event not found');
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('[EventsService] update error:', error);
      throw new InternalServerErrorException(
        error.message || 'Failed to update event. Please check the server logs.'
      );
    }
  }

  async publish(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.prisma.event.update({
      where: { id },
      data: { isPublished: true },
    });
  }

  async unpublish(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.prisma.event.update({
      where: { id },
      data: { isPublished: false },
    });
  }

  async remove(id: string) {
    return this.prisma.event.delete({ where: { id } });
  }
}

