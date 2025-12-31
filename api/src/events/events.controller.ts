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
    return this.eventsService.create({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      createdBy: req.user?.userId,
    });
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

