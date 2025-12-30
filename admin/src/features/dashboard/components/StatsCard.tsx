import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { cn } from '../../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'blue' | 'purple' | 'gold' | 'emerald' | 'red';
  isLoading?: boolean;
}

const colorClasses = {
  primary: {
    gradient: 'from-primary-400 to-primary-600',
    text: 'text-primary-600 dark:text-primary-400',
    bg: 'bg-primary-100 dark:bg-primary-900/50',
  },
  blue: {
    gradient: 'from-blue-400 to-blue-600',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/50',
  },
  purple: {
    gradient: 'from-purple-400 to-purple-600',
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/50',
  },
  gold: {
    gradient: 'from-amber-400 to-amber-600',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/50',
  },
  emerald: {
    gradient: 'from-emerald-400 to-emerald-600',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-100 dark:bg-emerald-900/50',
  },
  red: {
    gradient: 'from-red-400 to-red-600',
    text: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/50',
  },
};

export function StatsCard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'primary',
  isLoading = false,
}: StatsCardProps) {
  const colors = colorClasses[color];

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-gradient-to-br shadow-md',
              colors.gradient
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div
            className={cn(
              'flex items-center text-sm mt-1',
              trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
              trend === 'down' && 'text-red-600 dark:text-red-400',
              trend === 'neutral' && 'text-muted-foreground'
            )}
          >
            {trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
            {trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
            <span>{change}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Featured stat card with gradient background
export function FeaturedStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  isLoading = false,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="border-0">
        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-0 text-white', gradient)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-white/70 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          <Icon className="h-12 w-12 text-white/30" />
        </div>
      </CardContent>
    </Card>
  );
}







