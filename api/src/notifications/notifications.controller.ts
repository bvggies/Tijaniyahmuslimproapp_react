import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/jwt.guard';
import { RegisterDeviceDto, UpdatePreferencesDto, CreateCampaignDto } from './dto';

@Controller()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  // ==========================================
  // DEVICE REGISTRATION
  // ==========================================

  @Post('devices/register')
  @UseGuards(JwtAuthGuard)
  registerDevice(@Request() req, @Body() dto: RegisterDeviceDto) {
    return this.notificationsService.registerDevice(req.user.userId, dto);
  }

  @Delete('devices/:token')
  @UseGuards(JwtAuthGuard)
  unregisterDevice(@Request() req, @Param('token') token: string) {
    return this.notificationsService.unregisterDevice(req.user.userId, token);
  }

  @Get('devices')
  @UseGuards(JwtAuthGuard)
  getUserDevices(@Request() req) {
    return this.notificationsService.getUserDevices(req.user.userId);
  }

  // ==========================================
  // NOTIFICATION PREFERENCES
  // ==========================================

  @Get('notification-preferences')
  @UseGuards(JwtAuthGuard)
  getPreferences(@Request() req) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Patch('notification-preferences')
  @UseGuards(JwtAuthGuard)
  updatePreferences(@Request() req, @Body() dto: UpdatePreferencesDto) {
    return this.notificationsService.updatePreferences(req.user.userId, dto);
  }

  // ==========================================
  // IN-APP NOTIFICATIONS
  // ==========================================

  @Get('notifications')
  @UseGuards(JwtAuthGuard)
  getNotifications(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('status') status?: 'UNREAD' | 'READ' | 'ARCHIVED',
  ) {
    return this.notificationsService.getNotifications(req.user.userId, {
      limit: limit ? parseInt(limit) : 20,
      cursor,
      status,
    });
  }

  @Get('notifications/unread-count')
  @UseGuards(JwtAuthGuard)
  getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Patch('notifications/:id/read')
  @UseGuards(JwtAuthGuard)
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.userId, id);
  }

  @Patch('notifications/read-all')
  @UseGuards(JwtAuthGuard)
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Patch('notifications/:id/archive')
  @UseGuards(JwtAuthGuard)
  archiveNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.archiveNotification(req.user.userId, id);
  }

  // ==========================================
  // CAMPAIGNS (Admin endpoints)
  // ==========================================

  @Get('admin/campaigns')
  @UseGuards(JwtAuthGuard)
  getCampaigns(
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('status') status?: string,
  ) {
    return this.notificationsService.getCampaigns({
      limit: limit ? parseInt(limit) : 20,
      cursor,
      status,
    });
  }

  @Get('admin/campaigns/:id')
  @UseGuards(JwtAuthGuard)
  getCampaign(@Param('id') id: string) {
    return this.notificationsService.getCampaign(id);
  }

  @Post('admin/campaigns')
  @UseGuards(JwtAuthGuard)
  createCampaign(@Request() req, @Body() dto: CreateCampaignDto) {
    return this.notificationsService.createCampaign(dto, req.user.userId);
  }

  @Post('admin/campaigns/:id/send')
  @UseGuards(JwtAuthGuard)
  sendCampaign(@Param('id') id: string) {
    return this.notificationsService.executeCampaign(id);
  }

  @Delete('admin/campaigns/:id')
  @UseGuards(JwtAuthGuard)
  deleteCampaign(@Param('id') id: string) {
    return this.notificationsService.deleteCampaign(id);
  }
}

