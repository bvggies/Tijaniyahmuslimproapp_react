import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  DollarSign,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { StatsCard, FeaturedStatsCard } from './components/StatsCard';
import { ActivityFeed } from './components/ActivityFeed';
import { UserGrowthChart, DonationsChart } from './components/Charts';
import { 
  useOverviewStats, 
  useRecentActivity,
  useDailyStats,
  mockOverviewData, 
  mockDailyStats,
} from './hooks/useDashboardData';
import { formatCurrency, formatNumber } from '../../lib/utils';
import { toast } from '../../components/ui/use-toast';

export default function DashboardPage() {
  // Real API queries
  const { 
    data: overviewData, 
    isLoading: isLoadingOverview, 
    error: overviewError,
    refetch: refetchOverview 
  } = useOverviewStats();
  
  const { 
    data: activityData, 
    isLoading: isLoadingActivity, 
    error: activityError 
  } = useRecentActivity();

  // Get date range for daily stats (last 7 days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { data: dailyStatsData } = useDailyStats(startDate, endDate);

  const stats = overviewData || mockOverviewData;
  const activities = activityData || [];
  const chartData = dailyStatsData || mockDailyStats;

  const handleRefresh = async () => {
    try {
      await refetchOverview();
      toast.success('Dashboard refreshed', 'Data has been updated');
    } catch {
      toast.error('Refresh failed', 'Using cached data');
    }
  };

  const isLoading = isLoadingOverview;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your Tijaniyah community.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>


      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change="+12% from last month"
          trend="up"
          icon={Users}
          color="primary"
          isLoading={isLoading}
        />
        <StatsCard
          title="Posts Today"
          value={formatNumber(stats.postsToday)}
          change="+8% from yesterday"
          trend="up"
          icon={MessageSquare}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          change="+2 new this week"
          trend="up"
          icon={Calendar}
          color="purple"
          isLoading={isLoading}
        />
        <StatsCard
          title="Donations (Month)"
          value={formatCurrency(stats.donationsMonth)}
          change="-3% from last month"
          trend="down"
          icon={DollarSign}
          color="gold"
          isLoading={isLoading}
        />
      </div>

      {/* Featured Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <FeaturedStatsCard
          title="Pending Reports"
          value={stats.reportsPending}
          subtitle="Requires attention"
          icon={AlertTriangle}
          gradient="bg-gradient-to-br from-primary-500 to-primary-600"
          isLoading={isLoading}
        />
        <FeaturedStatsCard
          title="Active Users (7d)"
          value={formatNumber(stats.activeUsers7d)}
          subtitle={`${((stats.activeUsers7d / stats.totalUsers) * 100).toFixed(1)}% of total`}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          isLoading={isLoading}
        />
        <FeaturedStatsCard
          title="Today's Donations"
          value={formatCurrency(stats.donationsToday)}
          subtitle={`${stats.donationsWeek ? formatCurrency(stats.donationsWeek) : '$0'} this week`}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UserGrowthChart
          data={chartData}
          isLoading={isLoading}
          error={null}
        />
        <DonationsChart
          data={chartData}
          isLoading={isLoading}
          error={null}
        />
      </div>

      {/* Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed
          activities={activities}
          isLoading={isLoadingActivity}
          error={activityError as Error | null}
        />
        
        {/* Quick Actions / Additional Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Stats</h3>
          <div className="grid gap-4">
            <StatsCard
              title="New Users Today"
              value={stats.newUsersToday}
              change="Active registrations"
              trend="neutral"
              icon={Users}
              color="emerald"
              isLoading={isLoading}
            />
            <StatsCard
              title="Active Users (30d)"
              value={formatNumber(stats.activeUsers30d)}
              change={`${((stats.activeUsers30d / stats.totalUsers) * 100).toFixed(1)}% engagement`}
              trend="up"
              icon={TrendingUp}
              color="blue"
              isLoading={isLoading}
            />
            {stats.wazifaCompletions !== undefined && (
              <StatsCard
                title="Wazifa Completions"
                value={formatNumber(stats.wazifaCompletions)}
                change="This month"
                trend="up"
                icon={Calendar}
                color="purple"
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
