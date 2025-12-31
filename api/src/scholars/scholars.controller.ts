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
import { ScholarsService } from './scholars.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('scholars')
export class ScholarsController {
  constructor(private readonly scholarsService: ScholarsService) {}

  // Public endpoints
  @Get('public')
  findPublished() {
    return this.scholarsService.findPublished();
  }

  @Get('public/:id')
  findOnePublic(@Param('id') id: string) {
    return this.scholarsService.findOne(id);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AdminGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('published') published?: string,
  ) {
    return this.scholarsService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      published: published ? published === 'true' : undefined,
    });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.scholarsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any, @Request() req: any) {
    return this.scholarsService.create({
      ...body,
      createdBy: req.user?.userId,
    });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.scholarsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.scholarsService.remove(id);
  }
}

