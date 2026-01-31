import { Controller, Get, Query, UseGuards, Request, Logger } from '@nestjs/common';
import { AnalyticsService, Activity, DailyStats, OverviewStats } from './analytics.service';
import { JwtAuthGuard } from '../common/jwt.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview(@Request() req): Promise<OverviewStats> {
    try {
      return await this.analyticsService.getOverview();
    } catch (error) {
      this.logger.error('Error in getOverview endpoint:', error);
      // Return default stats instead of throwing error
      return {
        totalUsers: 0,
        activeUsers7d: 0,
        activeUsers30d: 0,
        newUsersToday: 0,
        postsToday: 0,
        reportsPending: 0,
        donationsToday: 0,
        donationsWeek: 0,
        donationsMonth: 0,
        upcomingEvents: 0,
        wazifaCompletions: 0,
        lazimCompletions: 0,
        totalNews: 0,
        totalEvents: 0,
        totalScholars: 0,
        totalLessons: 0,
        totalUsersLastMonth: 0,
        postsYesterday: 0,
        upcomingEventsLastWeek: 0,
        donationsMonthLastMonth: 0,
      };
    }
  }

  @Get('daily')
  getDailyStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<DailyStats[]> {
    return this.analyticsService.getDailyStats(startDate, endDate);
  }

  @Get('activity')
  getRecentActivity(@Query('limit') limit?: string): Promise<Activity[]> {
    return this.analyticsService.getRecentActivity(limit ? parseInt(limit) : 20);
  }
}

