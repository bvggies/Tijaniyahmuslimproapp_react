import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Activity {
  id: string;
  type: string;
  userName: string;
  description: string;
  timestamp: string;
}

export interface DailyStats {
  date: string;
  activeUsers: number;
  newUsers: number;
  posts: number;
  donations: number;
}

export interface OverviewStats {
  totalUsers: number;
  activeUsers7d: number;
  activeUsers30d: number;
  newUsersToday: number;
  postsToday: number;
  reportsPending: number;
  donationsToday: number;
  donationsWeek: number;
  donationsMonth: number;
  upcomingEvents: number;
  wazifaCompletions: number;
  lazimCompletions: number;
  // Comparison data for calculating changes
  totalUsersLastMonth?: number;
  postsYesterday?: number;
  upcomingEventsLastWeek?: number;
  donationsMonthLastMonth?: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverview(): Promise<OverviewStats> {
    const now = new Date();
    
    // Get total users
    const totalUsers = await this.prisma.user.count();

    // Get active users (logged in within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers7d = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers30d = await this.prisma.user.count({
      where: {
        updatedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get new users today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newUsersToday = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    // Get posts today
    const postsToday = await this.prisma.communityPost.count({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
    });

    // Get posts yesterday for comparison
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayStart);
    const postsYesterday = await this.prisma.communityPost.count({
      where: {
        createdAt: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    });

    // Get total users from last month for comparison (users that existed at the start of last month)
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1);
    lastMonthStart.setHours(0, 0, 0, 0);
    const totalUsersLastMonth = await this.prisma.user.count({
      where: {
        createdAt: {
          lt: lastMonthStart,
        },
      },
    });

    // Get upcoming events from last week for comparison
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const upcomingEventsLastWeek = await this.prisma.event.count({
      where: {
        isPublished: true,
        startDate: {
          gte: lastWeekStart,
          lt: now,
        },
        status: {
          in: ['UPCOMING', 'ONGOING'],
        },
      },
    });

    // Get pending reports (if you have a reports table, otherwise return 0)
    const reportsPending = 0; // TODO: Implement when reports table exists

    // Get donations today (if you have a donations table, otherwise return 0)
    const donationsToday = 0; // TODO: Implement when donations table exists
    const donationsWeek = 0;
    const donationsMonth = 0;

    // Get upcoming events
    const upcomingEvents = await this.prisma.event.count({
      where: {
        isPublished: true,
        startDate: {
          gte: now,
        },
        status: {
          in: ['UPCOMING', 'ONGOING'],
        },
      },
    });

    // Wazifa and Lazim completions (if you have these tables, otherwise return 0)
    const wazifaCompletions = 0; // TODO: Implement when wazifa table exists
    const lazimCompletions = 0; // TODO: Implement when lazim table exists

    return {
      totalUsers,
      activeUsers7d,
      activeUsers30d,
      newUsersToday,
      postsToday,
      reportsPending,
      donationsToday,
      donationsWeek,
      donationsMonth,
      upcomingEvents,
      wazifaCompletions,
      lazimCompletions,
      // Comparison data
      totalUsersLastMonth,
      postsYesterday,
      upcomingEventsLastWeek,
      donationsMonthLastMonth: 0, // TODO: Calculate when donations table exists
    };
  }

  async getDailyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const stats: DailyStats[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const activeUsers = await this.prisma.user.count({
        where: {
          updatedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const newUsers = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      const posts = await this.prisma.communityPost.count({
        where: {
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      });

      stats.push({
        date: currentDate.toISOString().split('T')[0],
        activeUsers,
        newUsers,
        posts,
        donations: 0, // TODO: Implement when donations table exists
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return stats;
  }

  async getRecentActivity(limit: number = 20) {
    const activities: Activity[] = [];

    // Get recent user signups
    const recentUsers = await this.prisma.user.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    recentUsers.forEach((user) => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_signup',
        userName: user.name || user.email,
        description: 'New user registered',
        timestamp: user.createdAt.toISOString(),
      });
    });

    // Get recent posts
    const recentPosts = await this.prisma.communityPost.findMany({
      take: Math.floor(limit / 2),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    recentPosts.forEach((post) => {
      activities.push({
        id: `post_${post.id}`,
        type: 'post_created',
        userName: post.user.name || post.user.email,
        description: 'New community post',
        timestamp: post.createdAt.toISOString(),
      });
    });

    // Sort by timestamp and limit
    activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return activities.slice(0, limit);
  }
}

