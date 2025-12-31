import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  GraduationCap, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
import { ScholarForm } from './components/ScholarForm';
import {
  useScholars,
  useCreateScholar,
  useUpdateScholar,
  useDeleteScholar,
} from './hooks/useScholars';
import { Scholar } from '../../lib/api/types';
import { toast } from '../../components/ui/use-toast';
import { formatDate, cn } from '../../lib/utils';

export default function ScholarsPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingScholar, setEditingScholar] = useState<Scholar | null>(null);
  const [deletingScholar, setDeletingScholar] = useState<Scholar | null>(null);

  // API Queries
  const { data, isLoading, error, refetch } = useScholars({
    search,
  });

  // Mutations
  const createMutation = useCreateScholar();
  const updateMutation = useUpdateScholar();
  const deleteMutation = useDeleteScholar();

  // Filter scholars
  const scholars = data?.data || [];

  const handleCreate = async (scholarData: Partial<Scholar>) => {
    try {
      await createMutation.mutateAsync(scholarData);
      setShowForm(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleUpdate = async (scholarData: Partial<Scholar>) => {
    if (!editingScholar) {
      setEditingScholar(null);
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editingScholar.id, data: scholarData });
      setEditingScholar(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!deletingScholar) {
      setDeletingScholar(null);
      return;
    }

    try {
      await deleteMutation.mutateAsync(deletingScholar.id);
      setDeletingScholar(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleTogglePublish = async (scholar: Scholar) => {
    try {
      await updateMutation.mutateAsync({
        id: scholar.id,
        data: { isPublished: !scholar.isPublished },
      });
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
            Scholars & Lessons
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage Islamic scholars, their profiles, and educational content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scholar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scholars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scholars Grid */}
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
        ) : scholars.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No scholars found</h3>
                <p className="text-muted-foreground mt-1">
                  Create your first scholar profile to get started
                </p>
                <Button className="mt-4" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Scholar
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          scholars.map((scholar) => (
            <Card key={scholar.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Scholar Image */}
              <div className="h-32 bg-gradient-to-br from-emerald-500 to-teal-600 relative">
                {scholar.imageUrl ? (
                  <img
                    src={scholar.imageUrl}
                    alt={scholar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-white/50" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant={scholar.isPublished ? 'success' : 'secondary'}>
                    {scholar.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              <CardContent className="pt-4">
                {/* Name & Title */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{scholar.name}</h3>
                    {scholar.nameArabic && (
                      <p className="text-sm text-muted-foreground line-clamp-1" dir="rtl">
                        {scholar.nameArabic}
                      </p>
                    )}
                    {scholar.title && (
                      <p className="text-xs text-muted-foreground mt-1">{scholar.title}</p>
                    )}
                  </div>
                </div>

                {/* Biography */}
                {scholar.biography && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {scholar.biography}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-1.5 text-sm">
                  {scholar.specialty && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{scholar.specialty}</span>
                    </div>
                  )}
                  {scholar.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{scholar.location}</span>
                    </div>
                  )}
                  {(scholar.birthYear || scholar.deathYear) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {scholar.birthYear || '?'} - {scholar.isAlive ? 'Present' : (scholar.deathYear || '?')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 mt-4 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setEditingScholar(scholar)}
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleTogglePublish(scholar)}
                    title={scholar.isPublished ? 'Unpublish' : 'Publish'}
                  >
                    {scholar.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setDeletingScholar(scholar)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Form Dialog */}
      <ScholarForm
        open={showForm || !!editingScholar}
        onClose={() => {
          setShowForm(false);
          setEditingScholar(null);
        }}
        onSubmit={editingScholar ? handleUpdate : handleCreate}
        scholar={editingScholar}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingScholar} onOpenChange={() => setDeletingScholar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scholar</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingScholar?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingScholar(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Scholar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
