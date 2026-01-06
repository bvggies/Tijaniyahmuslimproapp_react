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
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AdminGuard } from '../common/admin.guard';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Public endpoints
  @Get('public')
  findPublished() {
    return this.eventsService.findPublished();
  }

  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
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
  ) {
    return this.eventsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      category,
      status,
      published: published ? published === 'true' : undefined,
    });
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
        'Prayer': 'OTHER',
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

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}

