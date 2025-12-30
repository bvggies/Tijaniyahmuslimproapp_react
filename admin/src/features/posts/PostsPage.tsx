import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  Pin,
  Trash2,
  RefreshCw,
  Filter,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
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
import { cn, formatRelativeTime, getInitials } from '../../lib/utils';
import { toast } from '../../components/ui/use-toast';

// Mock posts data
const mockPosts = [
  {
    id: '1',
    content: 'Assalamu Alaikum! Welcome to the Tijaniyah community. May Allah bless us all on this spiritual journey. 🌙',
    userId: '1',
    userName: 'Demo User',
    userAvatarUrl: null,
    likesCount: 45,
    commentsCount: 12,
    isPinned: true,
    isLocked: false,
    isHidden: false,
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-01-28T10:00:00Z',
    mediaUrls: [],
  },
  {
    id: '2',
    content: 'Just completed my morning wazifa. Feeling blessed and grateful. Alhamdulillah! 🙏',
    userId: '2',
    userName: 'Ahmad Hassan',
    userAvatarUrl: null,
    likesCount: 32,
    commentsCount: 8,
    isPinned: false,
    isLocked: false,
    isHidden: false,
    createdAt: '2024-01-28T08:30:00Z',
    updatedAt: '2024-01-28T08:30:00Z',
    mediaUrls: [],
  },
  {
    id: '3',
    content: 'Question: What are the best resources for beginners learning about Tijaniyah? Any recommendations?',
    userId: '3',
    userName: 'Fatima Ali',
    userAvatarUrl: null,
    likesCount: 18,
    commentsCount: 25,
    isPinned: false,
    isLocked: false,
    isHidden: false,
    createdAt: '2024-01-27T16:00:00Z',
    updatedAt: '2024-01-27T16:00:00Z',
    mediaUrls: [],
  },
  {
    id: '4',
    content: 'This content has been flagged for review due to community guidelines violation.',
    userId: '4',
    userName: 'Anonymous User',
    userAvatarUrl: null,
    likesCount: 2,
    commentsCount: 0,
    isPinned: false,
    isLocked: true,
    isHidden: true,
    createdAt: '2024-01-26T12:00:00Z',
    updatedAt: '2024-01-27T09:00:00Z',
    mediaUrls: [],
  },
];

const mockReports = [
  {
    id: '1',
    type: 'post',
    targetId: '4',
    reportedBy: '5',
    reporterName: 'Ibrahim Khan',
    reason: 'Inappropriate content',
    description: 'This post contains misleading information about Islamic practices.',
    status: 'pending',
    createdAt: '2024-01-27T08:00:00Z',
  },
  {
    id: '2',
    type: 'comment',
    targetId: '12',
    reportedBy: '6',
    reporterName: 'Aisha Mohammed',
    reason: 'Spam',
    description: 'User is posting promotional links repeatedly.',
    status: 'pending',
    createdAt: '2024-01-26T15:00:00Z',
  },
  {
    id: '3',
    type: 'post',
    targetId: '8',
    reportedBy: '7',
    reporterName: 'Omar Said',
    reason: 'Harassment',
    description: 'User is targeting another community member with offensive comments.',
    status: 'reviewed',
    createdAt: '2024-01-25T10:00:00Z',
  },
];

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reports'>('posts');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<typeof mockPosts[0] | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.userName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pinned' && post.isPinned) ||
      (statusFilter === 'hidden' && post.isHidden) ||
      (statusFilter === 'locked' && post.isLocked) ||
      (statusFilter === 'active' && !post.isHidden && !post.isLocked);
    return matchesSearch && matchesStatus;
  });

  const pendingReports = mockReports.filter((r) => r.status === 'pending');

  const handlePostAction = (action: string, post: typeof mockPosts[0]) => {
    toast.info('Demo mode', `${action} action simulated for post`);
  };

  const handleReportAction = (action: 'resolve' | 'dismiss', report: typeof mockReports[0]) => {
    toast.info('Demo mode', `Report ${action}d successfully (simulated)`);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Posts & Moderation</h1>
          <p className="text-muted-foreground">
            Manage community posts and handle reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'posts' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('posts')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Posts ({mockPosts.length})
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('reports')}
          className="relative"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Reports ({pendingReports.length})
          {pendingReports.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pendingReports.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Demo indicator */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex items-center gap-2">
        <Filter className="h-4 w-4 text-amber-600" />
        <span className="text-sm text-amber-700 dark:text-amber-300">
          Showing demo data. Connect to API for live moderation.
        </span>
      </div>

      {activeTab === 'posts' ? (
        <>
          {/* Posts Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
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
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pinned">Pinned</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <Card>
            <CardHeader>
              <CardTitle>Posts ({filteredPosts.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    'p-4 rounded-xl border transition-colors',
                    post.isHidden && 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
                    post.isPinned && !post.isHidden && 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800',
                    !post.isHidden && !post.isPinned && 'bg-muted/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.userAvatarUrl || undefined} />
                      <AvatarFallback>{getInitials(post.userName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{post.userName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(post.createdAt)}
                        </span>
                        {post.isPinned && <Badge variant="default">Pinned</Badge>}
                        {post.isHidden && <Badge variant="destructive">Hidden</Badge>}
                        {post.isLocked && <Badge variant="warning">Locked</Badge>}
                      </div>
                      <p className="mt-1 text-sm">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>❤️ {post.likesCount}</span>
                        <span>💬 {post.commentsCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handlePostAction(post.isPinned ? 'Unpin' : 'Pin', post)}
                        title={post.isPinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className={cn('h-4 w-4', post.isPinned && 'fill-current')} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handlePostAction(post.isHidden ? 'Show' : 'Hide', post)}
                        title={post.isHidden ? 'Show' : 'Hide'}
                      >
                        {post.isHidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handlePostAction(post.isLocked ? 'Unlock' : 'Lock', post)}
                        title={post.isLocked ? 'Unlock' : 'Lock'}
                      >
                        {post.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handlePostAction('Delete', post)}
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
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
      ) : (
        /* Reports Tab */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Reports Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className={cn(
                  'p-4 rounded-xl border',
                  report.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200' : 'bg-muted/30'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'pending' ? 'warning' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-sm font-medium">{report.reason}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {report.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Reported by {report.reporterName} • {formatRelativeTime(report.createdAt)}
                    </p>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction('resolve', report)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReportAction('dismiss', report)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
