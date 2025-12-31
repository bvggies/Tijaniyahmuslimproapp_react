import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Eye, 
  EyeOff,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { EventForm } from './components/EventForm';
import {
  useEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  usePublishEvent,
  useUnpublishEvent,
  eventCategories,
} from './hooks/useEvents';
import { Event, CreateEventDto } from '../../lib/api/types';
import { toast } from '../../components/ui/use-toast';
import { formatDate, formatDateTime, cn } from '../../lib/utils';

export default function EventsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  // API Queries
  const { data, isLoading, error, refetch } = useEvents({
    search,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  // Mutations
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();
  const publishMutation = usePublishEvent();
  const unpublishMutation = useUnpublishEvent();

  // Filter events
  const events = data?.data || [];

  const handleCreate = async (eventData: CreateEventDto) => {
    try {
      await createMutation.mutateAsync(eventData);
      setShowForm(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleUpdate = async (eventData: CreateEventDto) => {
    if (!editingEvent) {
      setEditingEvent(null);
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editingEvent.id, data: eventData });
      setEditingEvent(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) {
      setDeletingEvent(null);
      return;
    }

    try {
      await deleteMutation.mutateAsync(deletingEvent.id);
      setDeletingEvent(null);
    } catch {
      // Error handled by mutation
    }
  };

  const handleTogglePublish = async (event: Event) => {
    try {
      if (event.isPublished) {
        await unpublishMutation.mutateAsync(event.id);
      } else {
        await publishMutation.mutateAsync(event.id);
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
            Event Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage community events, conferences, and gatherings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
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
                placeholder="Search events..."
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
                {eventCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
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
        ) : events.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground mt-1">
                  Create your first event to get started
                </p>
                <Button className="mt-4" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Event Image */}
              <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 relative">
                {event.imageUrl ? (
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-white/50" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant={event.isPublished ? 'success' : 'secondary'}>
                    {event.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>

              <CardContent className="pt-4">
                {/* Title & Category */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTogglePublish(event)}>
                        {event.isPublished ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingEvent(event)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Category */}
                <Badge variant="secondary" className="mb-3">
                  {event.category}
                </Badge>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {event.description}
                </p>

                {/* Details */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(event.startDate)}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  {event.rsvpCount !== undefined && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.rsvpCount} RSVPs</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {event.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-muted rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {event.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{event.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Form Dialog */}
      <EventForm
        open={showForm || !!editingEvent}
        onClose={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdate : handleCreate}
        event={editingEvent}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingEvent} onOpenChange={() => setDeletingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingEvent?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingEvent(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
