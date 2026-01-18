import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Tag,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { toast } from '../../components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsCategoriesApi } from '../../lib/api';
import { NewsCategory } from '../../lib/api/types';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  nameArabic: z.string().optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code (e.g., #FF5733)').optional().or(z.literal('')),
  icon: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function NewsCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NewsCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<NewsCategory | null>(null);
  const queryClient = useQueryClient();

  // API Queries
  const { data: categories, isLoading, error, refetch } = useQuery({
    queryKey: ['news-categories'],
    queryFn: () => newsCategoriesApi.getAll(),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<NewsCategory>) => newsCategoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-categories'] });
      toast.success('Category created', 'Category has been created successfully.');
      setShowForm(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error('Creation failed', error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsCategory> }) =>
      newsCategoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-categories'] });
      toast.success('Category updated', 'Category has been updated successfully.');
      setShowForm(false);
      reset();
    },
    onError: (error: Error) => {
      toast.error('Update failed', error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => newsCategoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-categories'] });
      toast.success('Category deleted', 'Category has been deleted.');
      setDeletingCategory(null);
    },
    onError: (error: Error) => {
      toast.error('Delete failed', error.message);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      isActive: true,
      sortOrder: 0,
    },
  });

  const handleOpenForm = (category?: NewsCategory) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        nameArabic: category.nameArabic || '',
        description: category.description || '',
        color: category.color || '',
        icon: category.icon || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        nameArabic: '',
        description: '',
        color: '',
        icon: '',
        isActive: true,
        sortOrder: categories?.length || 0,
      });
    }
    setShowForm(true);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const categoryData: Partial<NewsCategory> = {
        name: data.name,
        nameArabic: data.nameArabic || undefined,
        description: data.description || undefined,
        color: data.color || undefined,
        icon: data.icon || undefined,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      };

      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data: categoryData });
      } else {
        await createMutation.mutateAsync(categoryData);
      }
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (deletingCategory) {
      await deleteMutation.mutateAsync(deletingCategory.id);
    }
  };

  const activeCategories = categories?.filter(cat => cat.isActive) || [];
  const inactiveCategories = categories?.filter(cat => !cat.isActive) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            News Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage news article categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => handleOpenForm()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Category
          </Button>
        </div>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load categories</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Active Categories */}
          {activeCategories.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {category.icon && <span className="text-2xl">{category.icon}</span>}
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            {category.nameArabic && (
                              <p className="text-sm text-muted-foreground">{category.nameArabic}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenForm(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingCategory(category)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {category.color && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <Badge variant="outline">Sort: {category.sortOrder}</Badge>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Categories */}
          {inactiveCategories.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Inactive Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveCategories.map((category) => (
                  <Card key={category.id} className="opacity-60">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {category.icon && <span className="text-2xl">{category.icon}</span>}
                          <div>
                            <h3 className="font-semibold">{category.name}</h3>
                            {category.nameArabic && (
                              <p className="text-sm text-muted-foreground">{category.nameArabic}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenForm(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingCategory(category)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                      )}
                      <div className="flex items-center gap-2">
                        {category.color && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                        <Badge variant="outline">Sort: {category.sortOrder}</Badge>
                        <Badge variant="destructive">Inactive</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {categories?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <Tag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No categories yet. Create your first category!</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Create/Edit Form */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category details below'
                : 'Fill in the details to create a new news category'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., GENERAL, EVENTS"
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameArabic">Arabic Name (Optional)</Label>
                <Input
                  id="nameArabic"
                  placeholder="e.g., عام"
                  {...register('nameArabic')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of this category"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color (Hex Code)</Label>
                <Input
                  id="color"
                  placeholder="#FF5733"
                  {...register('color')}
                />
                {errors.color && (
                  <p className="text-sm text-destructive">{errors.color.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Emoji or Name)</Label>
                <Input
                  id="icon"
                  placeholder="📰 or newspaper"
                  {...register('icon')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  {...register('sortOrder', { valueAsNumber: true })}
                />
                {errors.sortOrder && (
                  <p className="text-sm text-destructive">{errors.sortOrder.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={watch('isActive')}
                    onChange={(e) => setValue('isActive', e.target.checked)}
                  />
                  <Label htmlFor="isActive" className="font-normal">Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
              {deletingCategory && (
                <span className="block mt-2 text-sm text-muted-foreground">
                  Note: If any news articles are using this category, you'll need to reassign them first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={deleteMutation.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

