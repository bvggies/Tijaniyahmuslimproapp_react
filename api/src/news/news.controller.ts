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
    return this.newsService.create({
      ...body,
      createdBy: req.user?.userId,
    });
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

