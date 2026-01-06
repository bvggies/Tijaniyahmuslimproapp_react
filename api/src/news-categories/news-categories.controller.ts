import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { NewsCategoriesService } from './news-categories.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('news-categories')
export class NewsCategoriesController {
  constructor(private readonly newsCategoriesService: NewsCategoriesService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('activeOnly') activeOnly?: string) {
    try {
      const activeOnlyBool = activeOnly === 'true' ? true : activeOnly === 'false' ? false : undefined;
      return this.newsCategoriesService.findAll(activeOnlyBool);
    } catch (error: any) {
      console.error('Error in news categories controller findAll:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to fetch news categories');
    }
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.newsCategoriesService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any) {
    try {
      // Validate required fields
      if (!body.name || !body.name.trim()) {
        throw new BadRequestException('Category name is required');
      }

      return this.newsCategoriesService.create({
        name: body.name,
        nameArabic: body.nameArabic,
        description: body.description,
        color: body.color,
        icon: body.icon,
        isActive: body.isActive !== undefined ? body.isActive : true,
        sortOrder: body.sortOrder,
      });
    } catch (error: any) {
      console.error('Error in news categories controller create:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to create news category');
    }
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    try {
      return this.newsCategoriesService.update(id, {
        name: body.name,
        nameArabic: body.nameArabic,
        description: body.description,
        color: body.color,
        icon: body.icon,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      });
    } catch (error: any) {
      console.error('Error in news categories controller update:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to update news category');
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.newsCategoriesService.delete(id);
  }
}

