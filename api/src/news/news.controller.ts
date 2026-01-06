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
import { NewsService } from './news.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // Public endpoints
  @Get('public')
  findPublished() {
    return this.newsService.findPublished();
  }

  @Get('featured')
  findFeatured() {
    return this.newsService.findFeatured();
  }

  @Get('public/:id')
  async findOnePublic(@Param('id') id: string) {
    await this.newsService.incrementViewCount(id);
    return this.newsService.findOne(id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
    @Query('published') published?: string,
  ) {
    return this.newsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      category,
      priority,
      published: published ? published === 'true' : undefined,
    });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any, @Request() req: any) {
    try {
      // Validate required fields
      if (!body.title || !body.content) {
        throw new BadRequestException('Missing required fields: title and content are required');
      }

      // Get user ID from request (try different possible properties)
      const userId = req.user?.userId || req.user?.id || req.user?.sub;

      // Category validation is now handled in the service layer
      // Categories are dynamic and can be created by admins

      // Validate priority if provided
      if (body.priority) {
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
        const priorityUpper = body.priority.toUpperCase();
        if (!validPriorities.includes(priorityUpper)) {
          throw new BadRequestException(`Invalid priority: ${body.priority}. Must be one of: ${validPriorities.join(', ')}`);
        }
      }

      return this.newsService.create({
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        imageUrl: body.imageUrl,
        category: body.category,
        priority: body.priority,
        isPublished: body.isPublished || false,
        isFeatured: body.isFeatured || false,
        createdBy: userId,
      });
    } catch (error: any) {
      console.error('Error creating news article:', error);
      console.error('Request body:', JSON.stringify(body, null, 2));
      console.error('User object:', req.user);
      
      // Re-throw NestJS exceptions as-is
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(error.message || 'Failed to create news article');
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.newsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.newsService.remove(id);
  }
}

