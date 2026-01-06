import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminGuard } from '../common/admin.guard';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public endpoints
  @Get('public')
  async findPublished() {
    try {
      // Wrap in additional try-catch to ensure we never throw
      try {
        const events = await this.eventsService.findPublished();
        // Always return an array, even if empty
        return Array.isArray(events) ? events : [];
      } catch (serviceError: any) {
        // If service throws, catch it and return empty array
        console.error('Service error in findPublished:', {
          message: serviceError.message,
          name: serviceError.name,
        });
        return [];
      }
    } catch (error: any) {
      // Final catch-all to ensure we never throw
      console.error('Controller error in findPublished:', {
        message: error.message,
        name: error.name,
      });
      // Always return empty array, never throw
      return [];
    }
  }

  @Get('upcoming')
  async findUpcoming() {
    try {
      const events = await this.eventsService.findUpcoming();
      // Always return an array, even if empty
      return Array.isArray(events) ? events : [];
    } catch (error: any) {
      // Log error but return empty array instead of throwing
      // This prevents 500 errors and allows the app to continue working
      console.error('Error in events controller findUpcoming:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('published') published?: string,
    @Query('search') search?: string,
  ) {
    try {
      // Parse and validate page
      let parsedPage: number | undefined;
      if (page) {
        parsedPage = parseInt(page, 10);
        if (isNaN(parsedPage) || parsedPage < 1) {
          parsedPage = 1;
        }
      }

      // Parse and validate limit
      let parsedLimit: number | undefined;
      if (limit) {
        parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
          parsedLimit = 20;
        }
        // Cap limit at 100 to prevent performance issues
        if (parsedLimit > 100) {
          parsedLimit = 100;
        }
      }

      return this.eventsService.findAll({
        page: parsedPage,
        limit: parsedLimit,
        category: category && category.trim() ? category.trim() : undefined,
        status: status && status.trim() ? status.trim() : undefined,
        published: published ? published === 'true' : undefined,
        search: search && search.trim() ? search.trim() : undefined,
      });
    } catch (error: any) {
      console.error('Error in events findAll:', error);
      console.error('Query params:', { page, limit, category, status, published, search });
      
      // Re-throw NestJS exceptions as-is
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Wrap other errors
      throw new BadRequestException(error.message || 'Failed to fetch events');
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any, @Request() req: any) {
    try {
      // Validate required fields
      if (!body.title || !body.description || !body.location) {
        throw new BadRequestException('Missing required fields: title, description, or location');
      }

      if (!body.startDate || !body.endDate) {
        throw new BadRequestException('Missing required fields: startDate or endDate');
      }

      // Parse dates
      const startDate = new Date(body.startDate);
      const endDate = new Date(body.endDate);

      // Validate dates
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException(`Invalid startDate format: ${body.startDate}`);
      }
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException(`Invalid endDate format: ${body.endDate}`);
      }

      // Validate endDate is after startDate
      if (endDate < startDate) {
        throw new BadRequestException('endDate must be after startDate');
      }

      // Get user ID from request (try different possible properties)
      const userId = req.user?.userId || req.user?.id || req.user?.sub;

      // Map category from form to enum value
      const categoryMap: Record<string, string> = {
        'Prayer': 'PRAYER',
        'Celebration': 'CELEBRATION',
        'Education': 'WORKSHOP',
        'Competition': 'OTHER',
        'Community': 'CONFERENCE',
        'Charity': 'OTHER',
        'Other': 'OTHER',
        'CONFERENCE': 'CONFERENCE',
        'SEMINAR': 'SEMINAR',
        'WORKSHOP': 'WORKSHOP',
        'CELEBRATION': 'CELEBRATION',
        'PRAYER': 'PRAYER',
        'OTHER': 'OTHER',
      };

      const mappedCategory = categoryMap[body.category] || 'OTHER';

      return this.eventsService.create({
        title: body.title,
        description: body.description,
        location: body.location,
        startDate,
        endDate,
        imageUrl: body.imageUrl || undefined,
        category: mappedCategory,
        status: body.status,
        isPublished: body.isPublished || false,
        maxAttendees: body.maxAttendees ? (typeof body.maxAttendees === 'string' ? parseInt(body.maxAttendees) : body.maxAttendees) : undefined,
        registrationRequired: body.registrationRequired || false,
        createdBy: userId,
      });
    } catch (error: any) {
      console.error('Error creating event:', error);
      console.error('Request body:', JSON.stringify(body, null, 2));
      console.error('User object:', req.user);
      // Re-throw NestJS exceptions as-is, wrap others
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to create event');
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    const data = { ...body };
    if (body.startDate) data.startDate = new Date(body.startDate);
    if (body.endDate) data.endDate = new Date(body.endDate);
    return this.eventsService.update(id, data);
  }

  @Patch(':id/publish')
  @UseGuards(AdminGuard)
  publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Patch(':id/unpublish')
  @UseGuards(AdminGuard)
  unpublish(@Param('id') id: string) {
    return this.eventsService.unpublish(id);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

