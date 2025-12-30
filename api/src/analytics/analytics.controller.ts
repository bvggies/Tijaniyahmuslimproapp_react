import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService, Activity } from './analytics.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview(@Request() req) {
    return this.analyticsService.getOverview();
  }

  @Get('daily')
  getDailyStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.analyticsService.getDailyStats(startDate, endDate);
  }

  @Get('activity')
  getRecentActivity(@Query('limit') limit?: string): Promise<Activity[]> {
    return this.analyticsService.getRecentActivity(limit ? parseInt(limit) : 20);
  }
}

