import React, { useState } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi, reportsApi } from '../../lib/api';
import { Post, Report } from '../../lib/api/types';

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reports'>('posts');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // API Queries
  const { data: postsData, isLoading: isLoadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ['posts', { search, statusFilter }],
    queryFn: () => postsApi.getAll({ search, limit: 100 }),
  });

  const { data: reportsData, isLoading: isLoadingReports, refetch: refetchReports } = useQuery({
    queryKey: ['reports', { status: 'pending' }],
    queryFn: () => reportsApi.getAll({ status: 'pending', limit: 100 }),
  });

  // Mutations
  const pinMutation = useMutation({
    mutationFn: (id: string) => postsApi.pin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post pinned', 'Post has been pinned.');
    },
  });

  const unpinMutation = useMutation({
    mutationFn: (id: string) => postsApi.unpin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post unpinned', 'Post has been unpinned.');
    },
  });

  const hideMutation = useMutation({
    mutationFn: (id: string) => postsApi.hide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post hidden', 'Post has been hidden from users.');
    },
  });

  const unhideMutation = useMutation({
    mutationFn: (id: string) => postsApi.unhide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post shown', 'Post is now visible to users.');
    },
  });

  const lockMutation = useMutation({
    mutationFn: (id: string) => postsApi.lock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post locked', 'Post comments have been locked.');
    },
  });

  const unlockMutation = useMutation({
    mutationFn: (id: string) => postsApi.unlock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post unlocked', 'Post comments are now open.');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted', 'Post has been deleted.');
    },
  });

  const resolveReportMutation = useMutation({
    mutationFn: ({ id, action, reason }: { id: string; action: string; reason: string }) =>
      reportsApi.resolve(id, action, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report resolved', 'Report has been resolved.');
    },
  });

  const dismissReportMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reportsApi.dismiss(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      toast.success('Report dismissed', 'Report has been dismissed.');
    },
  });

  const posts = postsData?.data || [];
  const reports = reportsData?.data || [];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      (post.content?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (post.userName?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'pinned' && post.isPinned) ||
      (statusFilter === 'hidden' && post.isHidden) ||
      (statusFilter === 'locked' && post.isLocked) ||
      (statusFilter === 'active' && !post.isHidden && !post.isLocked);
    return matchesSearch && matchesStatus;
  });

  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handlePostAction = async (action: string, post: Post) => {
    try {
      switch (action) {
        case 'Pin':
          await pinMutation.mutateAsync(post.id);
          break;
        case 'Unpin':
          await unpinMutation.mutateAsync(post.id);
          break;
        case 'Hide':
          await hideMutation.mutateAsync(post.id);
          break;
        case 'Show':
          await unhideMutation.mutateAsync(post.id);
          break;
        case 'Lock':
          await lockMutation.mutateAsync(post.id);
          break;
        case 'Unlock':
          await unlockMutation.mutateAsync(post.id);
          break;
        case 'Delete':
          if (window.confirm('Are you sure you want to delete this post?')) {
            await deletePostMutation.mutateAsync(post.id);
          }
          break;
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleReportAction = async (action: 'resolve' | 'dismiss', report: Report) => {
    try {
      if (action === 'resolve') {
        await resolveReportMutation.mutateAsync({
          id: report.id,
          action: 'warn',
          reason: 'Report resolved by admin',
        });
      } else {
        await dismissReportMutation.mutateAsync({
          id: report.id,
          reason: 'Report dismissed by admin',
        });
      }
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Posts & Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage community posts and handle reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            refetchPosts();
            refetchReports();
          }}>
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
            Posts ({posts.length})
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
              {isLoadingPosts ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No posts found</p>
                  <p className="text-sm">No posts match your search criteria.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
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
                        <span className="font-medium">{post.userName || 'Unknown User'}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(post.createdAt)}
                        </span>
                        {post.isPinned && <Badge variant="default">Pinned</Badge>}
                        {post.isHidden && <Badge variant="destructive">Hidden</Badge>}
                        {post.isLocked && <Badge variant="warning">Locked</Badge>}
                      </div>
                      <p className="mt-1 text-sm">{post.content || '(No content)'}</p>
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
                ))
              )}
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
            {isLoadingReports ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No reports found</p>
                <p className="text-sm">All reports have been resolved.</p>
              </div>
            ) : (
              reports.map((report) => (
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
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
