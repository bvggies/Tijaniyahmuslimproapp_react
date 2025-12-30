import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Event, CreateEventDto } from '../../../lib/api/types';
import { eventCategories } from '../hooks/useEvents';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  location: z.string().optional(),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventDto) => void;
  event?: Event | null;
  isLoading?: boolean;
}

export function EventForm({ open, onClose, onSubmit, event, isLoading }: EventFormProps) {
  const isEditing = Boolean(event);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          description: event.description,
          startDate: event.startDate.slice(0, 16),
          endDate: event.endDate.slice(0, 16),
          location: event.location || '',
          imageUrl: event.imageUrl || '',
          category: event.category,
          tags: event.tags?.join(', ') || '',
          isPublished: event.isPublished,
        }
      : {
          isPublished: false,
        },
  });

  const category = watch('category');

  React.useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        startDate: event.startDate.slice(0, 16),
        endDate: event.endDate.slice(0, 16),
        location: event.location || '',
        imageUrl: event.imageUrl || '',
        category: event.category,
        tags: event.tags?.join(', ') || '',
        isPublished: event.isPublished,
      });
    } else {
      reset({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        imageUrl: '',
        category: '',
        tags: '',
        isPublished: false,
      });
    }
  }, [event, reset]);

  const handleFormSubmit = (data: EventFormData) => {
    const eventData: CreateEventDto = {
      title: data.title,
      description: data.description,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      location: data.location || undefined,
      imageUrl: data.imageUrl || undefined,
      category: data.category,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      isPublished: data.isPublished,
    };
    onSubmit(eventData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the event details below'
              : 'Fill in the details to create a new event'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="Enter event title"
              error={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Describe the event..."
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                error={!!errors.startDate}
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date *
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                error={!!errors.endDate}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="Event location or 'Virtual'"
                {...register('location')}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">Category *</Label>
              <Select
                value={category}
                onValueChange={(v) => setValue('category', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Banner Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="tag1, tag2, tag3"
              {...register('tags')}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('isPublished')}
            />
            <Label htmlFor="isPublished" className="font-normal">
              Publish immediately (make visible to users)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

