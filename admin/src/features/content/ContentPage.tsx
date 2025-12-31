import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  BookOpen,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { duasApi, wazifaApi, jummaDhikrApi } from '../../lib/api';
import { Dua, Wazifa, JummaDhikr } from '../../lib/api/types';
import { toast } from '../../components/ui/use-toast';
import { formatDate, cn } from '../../lib/utils';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'duas' | 'wazifa' | 'dhikr'>('duas');
  const queryClient = useQueryClient();

  // Duas Queries
  const { data: duasData, isLoading: isLoadingDuas, refetch: refetchDuas } = useQuery({
    queryKey: ['duas'],
    queryFn: () => duasApi.getAll({ limit: 100 }),
  });

  // Wazifa Queries
  const { data: wazifaData, isLoading: isLoadingWazifa, refetch: refetchWazifa } = useQuery({
    queryKey: ['wazifa'],
    queryFn: () => wazifaApi.getAll({ limit: 100 }),
  });

  // Jumma Dhikr Queries
  const { data: dhikrData, isLoading: isLoadingDhikr, refetch: refetchDhikr } = useQuery({
    queryKey: ['jumma-dhikr'],
    queryFn: () => jummaDhikrApi.getAll(),
  });

  // Delete Mutations
  const deleteDuaMutation = useMutation({
    mutationFn: (id: string) => duasApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['duas'] });
      toast.success('Dua deleted', 'Dua has been deleted.');
    },
  });

  const deleteWazifaMutation = useMutation({
    mutationFn: (id: string) => wazifaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wazifa'] });
      toast.success('Wazifa deleted', 'Wazifa has been deleted.');
    },
  });

  const deleteDhikrMutation = useMutation({
    mutationFn: (id: string) => jummaDhikrApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jumma-dhikr'] });
      toast.success('Dhikr deleted', 'Jumma Dhikr has been deleted.');
    },
  });

  const duas = duasData?.data || [];
  const wazifas = wazifaData?.data || [];
  const dhikrs = dhikrData || [];

  const handleDeleteDua = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this dua?')) {
      await deleteDuaMutation.mutateAsync(id);
    }
  };

  const handleDeleteWazifa = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this wazifa?')) {
      await deleteWazifaMutation.mutateAsync(id);
    }
  };

  const handleDeleteDhikr = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Jumma Dhikr?')) {
      await deleteDhikrMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Content Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage duas, wazifa, dhikr, and other Islamic content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            refetchDuas();
            refetchWazifa();
            refetchDhikr();
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button
          variant={activeTab === 'duas' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('duas')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Duas ({duas.length})
        </Button>
        <Button
          variant={activeTab === 'wazifa' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('wazifa')}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Wazifa ({wazifas.length})
        </Button>
        <Button
          variant={activeTab === 'dhikr' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('dhikr')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Jumma Dhikr ({dhikrs.length})
        </Button>
      </div>

      {/* Duas Tab */}
      {activeTab === 'duas' && (
        <div className="space-y-4">
          {isLoadingDuas ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : duas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No duas found</h3>
                  <p className="text-muted-foreground mt-1">
                    Create your first dua to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {duas.map((dua) => (
                <Card key={dua.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{dua.title}</h3>
                        {dua.titleArabic && (
                          <p className="text-sm text-muted-foreground line-clamp-1" dir="rtl">
                            {dua.titleArabic}
                          </p>
                        )}
                      </div>
                      <Badge variant={dua.isPublished ? 'success' : 'secondary'}>
                        {dua.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {dua.category && (
                      <Badge variant="outline" className="mb-2">{dua.category}</Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {dua.content}
                    </p>
                    <div className="flex items-center gap-1 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDua(dua.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wazifa Tab */}
      {activeTab === 'wazifa' && (
        <div className="space-y-4">
          {isLoadingWazifa ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : wazifas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No wazifas found</h3>
                  <p className="text-muted-foreground mt-1">
                    Create your first wazifa to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wazifas.map((wazifa) => (
                <Card key={wazifa.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{wazifa.title}</h3>
                        {wazifa.titleArabic && (
                          <p className="text-sm text-muted-foreground line-clamp-1" dir="rtl">
                            {wazifa.titleArabic}
                          </p>
                        )}
                      </div>
                      <Badge variant={wazifa.isPublished ? 'success' : 'secondary'}>
                        {wazifa.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {wazifa.category && (
                      <Badge variant="outline" className="mb-2">{wazifa.category}</Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {wazifa.description}
                    </p>
                    {wazifa.steps && wazifa.steps.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {wazifa.steps.length} step{wazifa.steps.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <div className="flex items-center gap-1 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteWazifa(wazifa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jumma Dhikr Tab */}
      {activeTab === 'dhikr' && (
        <div className="space-y-4">
          {isLoadingDhikr ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : dhikrs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Jumma Dhikr found</h3>
                  <p className="text-muted-foreground mt-1">
                    Create your first Jumma Dhikr to get started
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dhikrs.map((dhikr) => (
                <Card key={dhikr.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-1">{dhikr.title}</h3>
                        {dhikr.titleArabic && (
                          <p className="text-sm text-muted-foreground line-clamp-1" dir="rtl">
                            {dhikr.titleArabic}
                          </p>
                        )}
                      </div>
                      <Badge variant={dhikr.isActive ? 'success' : 'secondary'}>
                        {dhikr.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {dhikr.dhikrs && dhikr.dhikrs.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">
                        {dhikr.dhikrs.length} dhikr item{dhikr.dhikrs.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    <div className="flex items-center gap-1 pt-3 border-t">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Delete"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDhikr(dhikr.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
