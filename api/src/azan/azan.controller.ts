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
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AzanService } from './azan.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('azan')
export class AzanController {
  constructor(private readonly azanService: AzanService) {}

  /** Public: list active azan schedules (for app to show and schedule notifications) */
  @Get('public')
  async findActive(@Query('activeOnly') activeOnly?: string) {
    const list = await this.azanService.findAll({
      activeOnly: activeOnly === 'true',
    });
    return Array.isArray(list) ? list : [];
  }

  /** Admin: list all */
  @Get()
  @UseGuards(AdminGuard)
  async findAll(@Query('activeOnly') activeOnly?: string) {
    return this.azanService.findAll({
      activeOnly: activeOnly === 'true' ? true : undefined,
    });
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: string) {
    return this.azanService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() body: any, @Request() req: any) {
    const userId = req.user?.userId ?? req.user?.id ?? req.user?.sub;
    return this.azanService.create({
      name: body.name,
      muezzin: body.muezzin,
      location: body.location,
      description: body.description,
      audioUrl: body.audioUrl,
      playAt: body.playAt,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
      createdBy: userId,
    });
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.azanService.update(id, {
      name: body.name,
      muezzin: body.muezzin,
      location: body.location,
      description: body.description,
      audioUrl: body.audioUrl,
      playAt: body.playAt,
      isActive: body.isActive,
      sortOrder: body.sortOrder,
    });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.azanService.remove(id);
  }
}
