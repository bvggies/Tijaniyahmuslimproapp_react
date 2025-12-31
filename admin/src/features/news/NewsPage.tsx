import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Search, 
  Plus, 
  Newspaper, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
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
import { formatDate, cn } from '../../lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../../lib/api';
import { NewsArticle } from '../../lib/api/types';

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  source: z.string().optional(),
  sourceUrl: z.union([z.string().url(), z.literal('')]).optional(),
  isPublished: z.boolean(),
});

type NewsFormData = z.infer<typeof newsSchema>;

const categories = ['Community', 'Events', 'Education', 'Global', 'Local', 'Announcements'];

export default function NewsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [deletingNews, setDeletingNews] = useState<NewsArticle | null>(null);
  const queryClient = useQueryClient();

  // API Queries
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', { search, category: categoryFilter !== 'all' ? categoryFilter : undefined }],
    queryFn: () => newsApi.getAll({ search, category: categoryFilter !== 'all' ? categoryFilter : undefined, limit: 100 }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<NewsArticle>) => newsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Article created', 'Article has been created successfully.');
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsArticle> }) =>
      newsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Article updated', 'Article has been updated successfully.');
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Article deleted', 'Article has been deleted.');
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => newsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Article published', 'Article is now visible to users.');
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => newsApi.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Article unpublished', 'Article is now hidden from users.');
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: { isPublished: false },
  });

  const news = data?.data || [];
  const filteredNews = news.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenForm = (article?: NewsArticle) => {
    if (article) {
      setEditingNews(article);
      reset({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        imageUrl: article.imageUrl || '',
        source: article.source || '',
        isPublished: article.isPublished,
      });
    } else {
      setEditingNews(null);
      reset({ isPublished: false });
    }
    setShowForm(true);
  };

  const onSubmit = async (data: NewsFormData) => {
    try {
      if (editingNews) {
        await updateMutation.mutateAsync({
          id: editingNews.id,
          data: {
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            imageUrl: data.imageUrl || undefined,
            source: data.source || undefined,
            isPublished: data.isPublished,
          },
        });
      } else {
        await createMutation.mutateAsync({
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          imageUrl: data.imageUrl || undefined,
          source: data.source || undefined,
          isPublished: data.isPublished,
        });
      }
      setShowForm(false);
      reset();
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (deletingNews) {
      try {
        await deleteMutation.mutateAsync(deletingNews.id);
        setDeletingNews(null);
      } catch {
        // Error handled by mutation
      }
    }
  };

  const togglePublish = async (article: NewsArticle) => {
    try {
      if (article.isPublished) {
        await unpublishMutation.mutateAsync(article.id);
      } else {
        await publishMutation.mutateAsync(article.id);
      }
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            News Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage news articles, announcements, and updates for your community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => handleOpenForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : filteredNews.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground mt-1">
                  Create your first article to get started
                </p>
                <Button className="mt-4" onClick={() => handleOpenForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative flex items-center justify-center">
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Newspaper className="h-12 w-12 text-white/50" />
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={article.isPublished ? 'success' : 'secondary'}>
                  {article.isPublished ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </div>
            <CardContent className="pt-4">
              <Badge variant="outline" className="mb-2">{article.category}</Badge>
              <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {article.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{article.source || 'No source'}</span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1 mt-3 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleOpenForm(article)}
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => togglePublish(article)}
                  title={article.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {article.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setDeletingNews(article)}
                  title="Delete"
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" error={!!errors.title} {...register('title')} />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <textarea
                id="excerpt"
                className="flex min-h-[60px] w-full rounded-xl border bg-background px-4 py-2 text-sm"
                {...register('excerpt')}
              />
              {errors.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <textarea
                id="content"
                className="flex min-h-[150px] w-full rounded-xl border bg-background px-4 py-2 text-sm"
                {...register('content')}
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={watch('category')} onValueChange={(v) => setValue('category', v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" {...register('source')} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" placeholder="https://..." {...register('imageUrl')} />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isPublished" {...register('isPublished')} />
              <Label htmlFor="isPublished" className="font-normal">Publish immediately</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingNews ? 'Save Changes' : 'Create Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingNews} onOpenChange={() => setDeletingNews(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingNews?.title}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingNews(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
