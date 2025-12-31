import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Bell, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  User,
  Crown,
  UserPlus,
  UserX,
  Activity,
  GraduationCap,
  AlertCircle,
  Filter,
  Trash2,
  Edit,
  Copy,
  Calendar,
  Mail,
  Target,
  Zap,
  RefreshCw,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from '../../components/ui/use-toast';
import { cn, formatDateTime, formatNumber } from '../../lib/utils';
import {
  userSegments,
  notificationTemplates,
  UserSegment,
  useNotificationCampaigns,
  useCreateCampaign,
  useSendCampaign,
  useDeleteCampaign,
} from './hooks/useNotifications';

const notificationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  targetAudience: z.string().min(1, 'Please select an audience'),
  scheduledAt: z.string().optional(),
  sendNow: z.boolean(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const segmentIcons: Record<string, React.ElementType> = {
  users: Users,
  crown: Crown,
  user: User,
  'user-plus': UserPlus,
  'user-x': UserX,
  activity: Activity,
  'graduation-cap': GraduationCap,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
  filter: Filter,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'automation'>('campaigns');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // API hooks
  const { data: campaignsData, isLoading: isLoadingCampaigns, refetch } = useNotificationCampaigns({ 
    status: statusFilter === 'all' ? undefined : statusFilter 
  });
  const createCampaignMutation = useCreateCampaign();
  const sendCampaignMutation = useSendCampaign();
  const deleteCampaignMutation = useDeleteCampaign();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { sendNow: true, targetAudience: 'all' },
  });

  const targetAudience = watch('targetAudience');
  const sendNow = watch('sendNow');

  // Filter campaigns by search
  const campaigns = campaignsData?.data || [];
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleCreateNotification = async (data: NotificationFormData) => {
    try {
      // Map targetAudience to backend targetType
      let targetType: 'all' | 'new_users' | 'active_users' | 'inactive_users' | 'custom' = 'all';
      if (data.targetAudience === 'new_users_7d' || data.targetAudience === 'new_users_30d') {
        targetType = 'new_users';
      } else if (data.targetAudience === 'active_users') {
        targetType = 'active_users';
      } else if (data.targetAudience === 'inactive_7d' || data.targetAudience === 'inactive_30d') {
        targetType = 'inactive_users';
      } else if (data.targetAudience === 'custom') {
        targetType = 'custom';
      }

      await createCampaignMutation.mutateAsync({
        title: data.title,
        body: data.body,
        targetType,
        scheduledAt: data.sendNow ? undefined : data.scheduledAt,
        sendNow: data.sendNow,
      });
      
      setShowCreateDialog(false);
      reset();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleSendCampaign = async (id: string) => {
    try {
      await sendCampaignMutation.mutateAsync(id);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaignMutation.mutateAsync(id);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleUseTemplate = (template: typeof notificationTemplates[0]) => {
    setValue('title', template.title);
    setValue('body', template.body);
    setSelectedTemplate(template.id);
    toast.info('Template applied', `Using "${template.name}" template.`);
  };

  const handleSendToUser = (userId: string, userName: string) => {
    toast.success('Notification sent', `Direct notification sent to ${userName}.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'success';
      case 'scheduled': return 'info';
      case 'draft': return 'secondary';
      case 'sending': return 'warning';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Send push notifications to users and manage campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoadingCampaigns}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingCampaigns && "animate-spin")} />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sent</p>
                <p className="text-2xl font-bold">
                  {formatNumber(
                    campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0)
                  )}
                </p>
              </div>
              <Send className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Open Rate</p>
                <p className="text-2xl font-bold">
                  {(() => {
                    const campaignsWithOpenRate = campaigns.filter(c => c.openRate !== undefined);
                    if (campaignsWithOpenRate.length === 0) return '0%';
                    const avgOpenRate = campaignsWithOpenRate.reduce((sum, c) => sum + (c.openRate || 0), 0) / campaignsWithOpenRate.length;
                    return `${(avgOpenRate * 100).toFixed(1)}%`;
                  })()}
                </p>
              </div>
              <Mail className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.status === 'scheduled').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Automations</p>
                <p className="text-2xl font-bold">
                  {campaigns.filter(c => c.trigger !== 'manual' && c.status === 'sent').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'campaigns' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('campaigns')}
        >
          <Bell className="h-4 w-4 mr-2" />
          Campaigns
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('templates')}
        >
          <Copy className="h-4 w-4 mr-2" />
          Templates
        </Button>
        <Button
          variant={activeTab === 'automation' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('automation')}
        >
          <Zap className="h-4 w-4 mr-2" />
          Automation
        </Button>
      </div>

      {activeTab === 'campaigns' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Campaigns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingCampaigns ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No campaigns found</p>
                  <p className="text-sm">Create your first notification campaign to get started.</p>
                </div>
              ) : filteredCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <Badge variant={getStatusColor(campaign.status) as any}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {campaign.body}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {campaign.targetType === 'custom' ? 'Custom segment' : 
                           userSegments.find(s => s.value === campaign.targetType)?.label || campaign.targetType}
                        </span>
                        {campaign.sentCount && (
                          <span className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            {formatNumber(campaign.sentCount)} sent
                          </span>
                        )}
                        {campaign.openRate && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {(campaign.openRate * 100).toFixed(1)}% opened
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {campaign.sentAt ? formatDateTime(campaign.sentAt) : 
                           campaign.scheduledAt ? `Scheduled: ${formatDateTime(campaign.scheduledAt)}` :
                           formatDateTime(campaign.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {campaign.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          title="Send now"
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={sendCampaignMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon-sm" title="Duplicate">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        title="Delete" 
                        className="text-red-600"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        disabled={deleteCampaignMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'templates' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notificationTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Badge variant="outline" className="mb-3">{template.category}</Badge>
                <h3 className="font-semibold mb-1">{template.name}</h3>
                <p className="text-sm font-medium mb-1">{template.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{template.body}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleUseTemplate(template);
                    setShowCreateDialog(true);
                  }}
                >
                  Use Template
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'automation' && (
        <Card>
          <CardHeader>
            <CardTitle>Automated Notifications</CardTitle>
            <CardDescription>
              Set up notifications that are automatically sent based on triggers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Welcome Message', trigger: 'User signs up', status: 'active', sent: 1456 },
              { name: 'Daily Prayer Reminder', trigger: 'Prayer time', status: 'active', sent: 45200 },
              { name: 'Inactive User Reminder', trigger: '7 days inactive', status: 'active', sent: 890 },
              { name: 'Birthday Greeting', trigger: 'User birthday', status: 'paused', sent: 234 },
              { name: 'Weekly Digest', trigger: 'Every Sunday', status: 'active', sent: 12400 },
            ].map((automation, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    automation.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-gray-100 dark:bg-gray-800'
                  )}>
                    <Zap className={cn(
                      'h-5 w-5',
                      automation.status === 'active' ? 'text-emerald-600' : 'text-gray-400'
                    )} />
                  </div>
                  <div>
                    <p className="font-medium">{automation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Trigger: {automation.trigger} • {formatNumber(automation.sent)} sent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={automation.status === 'active' ? 'success' : 'secondary'}>
                    {automation.status}
                  </Badge>
                  <Button variant="ghost" size="icon-sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Automation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Notification Campaign</DialogTitle>
            <DialogDescription>
              Send a notification to users or schedule it for later
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleCreateNotification)} className="space-y-6">
            {/* Notification Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Notification Title *</Label>
                <Input
                  id="title"
                  placeholder="🔔 Your notification title"
                  error={!!errors.title}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Message Body *</Label>
                <textarea
                  id="body"
                  placeholder="Write your notification message..."
                  className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                  {...register('body')}
                />
                {errors.body && (
                  <p className="text-sm text-red-500">{errors.body.message}</p>
                )}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-4">
              <Label>Target Audience *</Label>
              <div className="grid gap-2 md:grid-cols-2">
                {userSegments.slice(0, 8).map((segment) => {
                  const Icon = segmentIcons[segment.icon] || Users;
                  const isSelected = targetAudience === segment.value;
                  return (
                    <button
                      key={segment.value}
                      type="button"
                      onClick={() => setValue('targetAudience', segment.value)}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                          : 'border-border hover:border-primary-300'
                      )}
                    >
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        isSelected ? 'bg-primary-500 text-white' : 'bg-muted'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{segment.label}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {segment.description}
                        </p>
                      </div>
                      {segment.estimatedCount && segment.estimatedCount > 0 && (
                        <Badge variant="secondary" className="shrink-0">
                          ~{formatNumber(segment.estimatedCount)}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Custom user selection option */}
              <button
                type="button"
                onClick={() => {
                  setValue('targetAudience', 'custom');
                  setShowUserSelector(true);
                }}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                  targetAudience === 'custom'
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                    : 'border-border hover:border-primary-300'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  targetAudience === 'custom' ? 'bg-primary-500 text-white' : 'bg-muted'
                )}>
                  <Filter className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Select Specific Users</p>
                  <p className="text-xs text-muted-foreground">
                    Choose individual users or apply custom filters
                  </p>
                </div>
                {selectedUsers.length > 0 && (
                  <Badge variant="secondary">
                    {selectedUsers.length} selected
                  </Badge>
                )}
              </button>
            </div>

            {/* Scheduling */}
            <div className="space-y-4">
              <Label>Delivery</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={sendNow}
                    onChange={() => setValue('sendNow', true)}
                    className="text-primary-600"
                  />
                  <span className="text-sm">Send immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!sendNow}
                    onChange={() => setValue('sendNow', false)}
                    className="text-primary-600"
                  />
                  <span className="text-sm">Schedule for later</span>
                </label>
              </div>
              
              {!sendNow && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    {...register('scheduledAt')}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {sendNow ? (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
