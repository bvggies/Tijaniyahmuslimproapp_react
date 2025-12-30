import React from 'react';
import { 
  UserPlus, 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Skeleton } from '../../../components/ui/skeleton';
import { Badge } from '../../../components/ui/badge';
import { cn, formatRelativeTime } from '../../../lib/utils';
import type { ActivityItem } from '../../../lib/api/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  error?: Error | null;
}

const activityConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  user_signup: {
    icon: UserPlus,
    color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/50',
    label: 'New User',
  },
  post_created: {
    icon: MessageSquare,
    color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/50',
    label: 'Post',
  },
  donation: {
    icon: DollarSign,
    color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/50',
    label: 'Donation',
  },
  event_created: {
    icon: Calendar,
    color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/50',
    label: 'Event',
  },
  report: {
    icon: AlertTriangle,
    color: 'text-red-500 bg-red-100 dark:bg-red-900/50',
    label: 'Report',
  },
};

export function ActivityFeed({ activities, isLoading, error }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary-200 animate-pulse" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Failed to load activity</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activities?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Activity will appear here as users interact with the app
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
          {activities.map((activity) => {
            const config = activityConfig[activity.type] || activityConfig.post_created;
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    config.color
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium truncate">
                      {activity.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.timestamp)}
                    {activity.userName && (
                      <span className="ml-1">• {activity.userName}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}




