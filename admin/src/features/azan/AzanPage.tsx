import React, { useState } from 'react';
import {
  Plus,
  Volume2,
  Edit,
  Trash2,
  RefreshCw,
  Clock,
  MapPin,
  User,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { AzanSchedule, CreateAzanDto } from '../../lib/api/types';
import {
  useAzans,
  useCreateAzan,
  useUpdateAzan,
  useDeleteAzan,
} from './hooks/useAzans';

const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function formatPlayAt(playAt: string): string {
  const [h, m] = playAt.split(':').map(Number);
  const h12 = h % 12 || 12;
  const ampm = h < 12 ? 'AM' : 'PM';
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function AzanPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AzanSchedule | null>(null);
  const [deletingItem, setDeletingItem] = useState<AzanSchedule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    muezzin: '',
    location: '',
    description: '',
    audioUrl: '',
    playAtHour: 5,
    playAtMinute: 30,
    isActive: true,
    sortOrder: 0,
  });

  const { data: list = [], isLoading, refetch } = useAzans();
  const createMutation = useCreateAzan();
  const updateMutation = useUpdateAzan();
  const deleteMutation = useDeleteAzan();

  const azans = Array.isArray(list) ? list : [];

  const resetForm = () => {
    setFormData({
      name: '',
      muezzin: '',
      location: '',
      description: '',
      audioUrl: '',
      playAtHour: 5,
      playAtMinute: 30,
      isActive: true,
      sortOrder: 0,
    });
    setEditingItem(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (item: AzanSchedule) => {
    const [h, m] = item.playAt.split(':').map(Number);
    setFormData({
      name: item.name,
      muezzin: item.muezzin || '',
      location: item.location || '',
      description: item.description || '',
      audioUrl: item.audioUrl,
      playAtHour: isNaN(h) ? 5 : h,
      playAtMinute: isNaN(m) ? 30 : m,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const playAtString = () =>
    `${String(formData.playAtHour).padStart(2, '0')}:${String(formData.playAtMinute).padStart(2, '0')}`;

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    if (!formData.audioUrl.trim()) return;
    const payload: CreateAzanDto = {
      name: formData.name.trim(),
      muezzin: formData.muezzin.trim() || undefined,
      location: formData.location.trim() || undefined,
      description: formData.description.trim() || undefined,
      audioUrl: formData.audioUrl.trim(),
      playAt: playAtString(),
      isActive: formData.isActive,
      sortOrder: formData.sortOrder,
    };
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setShowForm(false);
      resetForm();
      refetch();
    } catch {
      // Error handled by mutation toast
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) {
      setDeletingItem(null);
      return;
    }
    try {
      await deleteMutation.mutateAsync(deletingItem.id);
      setDeletingItem(null);
      refetch();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with prominent Add Azan button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Azan Schedules
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage azan play times. Users can enable these in the app to hear azan at set times daily.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Azan
          </Button>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : azans.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No azan schedules yet</h3>
              <p className="text-muted-foreground mt-1">
                Add an azan schedule so users can play it at a set time daily (e.g. Fajr, Dhuhr).
              </p>
              <Button className="mt-4" onClick={openAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Azan
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {azans.map((item: AzanSchedule) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                  <Badge variant={item.isActive ? 'success' : 'secondary'}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4 shrink-0" />
                  {formatPlayAt(item.playAt)}
                </div>
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                )}
                {item.muezzin && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{item.muezzin}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(item)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => setDeletingItem(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); resetForm(); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Azan Schedule' : 'Add Azan Schedule'}</DialogTitle>
            <DialogDescription>
              Set name, audio URL, and daily play time (24h). Users can turn azan on/off in app Settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Fajr - Makkah"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Muezzin</label>
              <Input
                value={formData.muezzin}
                onChange={(e) => setFormData((p) => ({ ...p, muezzin: e.target.value }))}
                placeholder="e.g. Sheikh Abdul Rahman Al-Sudais"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Masjid al-Haram, Makkah"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Short description"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Audio URL *</label>
              <Input
                value={formData.audioUrl}
                onChange={(e) => setFormData((p) => ({ ...p, audioUrl: e.target.value }))}
                placeholder="https://example.com/azan.mp3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Hour (24h)</label>
                <Select
                  value={String(formData.playAtHour)}
                  onValueChange={(v) => setFormData((p) => ({ ...p, playAtHour: parseInt(v, 10) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS_24.map((h) => (
                      <SelectItem key={h} value={String(h)}>
                        {String(h).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Minute</label>
                <Select
                  value={String(formData.playAtMinute)}
                  onValueChange={(v) => setFormData((p) => ({ ...p, playAtMinute: parseInt(v, 10) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={String(m)}>
                        {String(m).padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Sort order</label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData((p) => ({ ...p, sortOrder: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="azan-active"
                checked={formData.isActive}
                onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-input"
              />
              <label htmlFor="azan-active" className="text-sm font-medium">Active (shown to users)</label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name.trim() || !formData.audioUrl.trim()}>
              {editingItem ? 'Update' : 'Add Azan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deletingItem} onOpenChange={(open) => { if (!open) setDeletingItem(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Azan Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingItem?.name}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
