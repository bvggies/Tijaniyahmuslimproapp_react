import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MakkahLiveService } from './makkah-live.service';
import { CreateChannelDto, UpdateChannelDto, ChannelQueryDto } from './dto/channel.dto';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('makkah-live')
export class MakkahLiveController {
  constructor(private readonly makkahLiveService: MakkahLiveService) {}

  /**
   * Get all active channels (Public)
   */
  @Get('channels')
  async getChannels(@Query() query: ChannelQueryDto) {
    return this.makkahLiveService.getChannels(query);
  }

  /**
   * Get all channels for admin (includes inactive)
   */
  @Get('admin/channels')
  @UseGuards(JwtAuthGuard)
  async getAllChannelsAdmin() {
    return this.makkahLiveService.getAllChannelsAdmin();
  }

  /**
   * Get a single channel by ID
   */
  @Get('channels/:id')
  async getChannelById(@Param('id') id: string) {
    return this.makkahLiveService.getChannelById(id);
  }

  /**
   * Create a new channel (Admin only)
   */
  @Post('admin/channels')
  @UseGuards(JwtAuthGuard)
  async createChannel(@Body() dto: CreateChannelDto, @Req() req: any) {
    return this.makkahLiveService.createChannel(dto, req.user?.id);
  }

  /**
   * Update a channel (Admin only)
   */
  @Put('admin/channels/:id')
  @UseGuards(JwtAuthGuard)
  async updateChannel(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    return this.makkahLiveService.updateChannel(id, dto);
  }

  /**
   * Delete a channel (Admin only)
   */
  @Delete('admin/channels/:id')
  @UseGuards(JwtAuthGuard)
  async deleteChannel(@Param('id') id: string) {
    return this.makkahLiveService.deleteChannel(id);
  }

  /**
   * Toggle channel active status (Admin only)
   */
  @Put('admin/channels/:id/toggle-status')
  @UseGuards(JwtAuthGuard)
  async toggleChannelStatus(@Param('id') id: string) {
    return this.makkahLiveService.toggleChannelStatus(id);
  }

  /**
   * Toggle channel featured status (Admin only)
   */
  @Put('admin/channels/:id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  async toggleChannelFeatured(@Param('id') id: string) {
    return this.makkahLiveService.toggleChannelFeatured(id);
  }

  /**
   * Reorder channels (Admin only)
   */
  @Put('admin/channels/reorder')
  @UseGuards(JwtAuthGuard)
  async reorderChannels(@Body() body: { orders: { id: string; sortOrder: number }[] }) {
    return this.makkahLiveService.reorderChannels(body.orders);
  }

  /**
   * Seed default channels (Admin only - for initial setup)
   */
  @Post('admin/seed')
  @UseGuards(JwtAuthGuard)
  async seedDefaultChannels() {
    return this.makkahLiveService.seedDefaultChannels();
  }
}

