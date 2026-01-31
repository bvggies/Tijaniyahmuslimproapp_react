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

// Build ISO string from date + 12h time (so AM/PM always shows in form)
function toISOFromParts(dateStr: string, hour: number, minute: number, ampm: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const hour24 = ampm === 'PM' ? (hour === 12 ? 12 : hour + 12) : (hour === 12 ? 0 : hour);
  return new Date(y, m - 1, d, hour24, minute).toISOString();
}

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDateDate: z.string().min(1, 'Start date is required'),
  startHour: z.number().min(1).max(12),
  startMinute: z.number().min(0).max(59),
  startAmPm: z.enum(['AM', 'PM']),
  endDateDate: z.string().min(1, 'End date is required'),
  endHour: z.number().min(1).max(12),
  endMinute: z.number().min(0).max(59),
  endAmPm: z.enum(['AM', 'PM']),
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

  const parseEventDate = (iso: string): { date: string; hour: number; minute: number; ampm: 'AM' | 'PM' } => {
    const d = new Date(iso);
    return {
      date: d.toISOString().slice(0, 10),
      hour: d.getHours() % 12 || 12,
      minute: d.getMinutes(),
      ampm: (d.getHours() >= 12 ? 'PM' : 'AM') as 'AM' | 'PM',
    };
  };

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
      ? ((): EventFormData => {
          const start = parseEventDate(event.startDate);
          const end = parseEventDate(event.endDate);
          return {
            title: event.title,
            description: event.description,
            startDateDate: start.date,
            startHour: start.hour,
            startMinute: start.minute,
            startAmPm: start.ampm,
            endDateDate: end.date,
            endHour: end.hour,
            endMinute: end.minute,
            endAmPm: end.ampm,
            location: event.location || '',
            imageUrl: event.imageUrl || '',
            category: event.category,
            tags: event.tags?.join(', ') || '',
            isPublished: event.isPublished,
          };
        })()
      : {
          startHour: 12,
          startMinute: 0,
          startAmPm: 'PM',
          endHour: 12,
          endMinute: 0,
          endAmPm: 'PM',
          isPublished: false,
        },
  });

  const category = watch('category');

  React.useEffect(() => {
    if (event) {
      const start = parseEventDate(event.startDate);
      const end = parseEventDate(event.endDate);
      reset({
        title: event.title,
        description: event.description,
        startDateDate: start.date,
        startHour: start.hour,
        startMinute: start.minute,
        startAmPm: start.ampm,
        endDateDate: end.date,
        endHour: end.hour,
        endMinute: end.minute,
        endAmPm: end.ampm,
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
        startDateDate: '',
        startHour: 12,
        startMinute: 0,
        startAmPm: 'PM',
        endDateDate: '',
        endHour: 12,
        endMinute: 0,
        endAmPm: 'PM',
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
      startDate: toISOFromParts(data.startDateDate, data.startHour, data.startMinute, data.startAmPm),
      endDate: toISOFromParts(data.endDateDate, data.endHour, data.endMinute, data.endAmPm),
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

          {/* Start Date & Time (date + AM/PM so it shows on all browsers) */}
          <div className="grid grid-cols-1 gap-4">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Start Date & Time *
            </Label>
            <div className="flex flex-wrap items-end gap-2">
              <Input
                id="startDateDate"
                type="date"
                className="w-[140px]"
                error={!!errors.startDateDate}
                {...register('startDateDate')}
              />
              <Select
                value={String(watch('startHour') ?? 12)}
                onValueChange={(v) => setValue('startHour', parseInt(v, 10))}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="Hr" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(watch('startMinute') ?? 0)}
                onValueChange={(v) => setValue('startMinute', parseInt(v, 10))}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n.toString().padStart(2, '0')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={watch('startAmPm') ?? 'PM'}
                onValueChange={(v) => setValue('startAmPm', v as 'AM' | 'PM')}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(errors.startDateDate || errors.startHour) && (
              <p className="text-sm text-red-500">{errors.startDateDate?.message || errors.startHour?.message}</p>
            )}
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-1 gap-4">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              End Date & Time *
            </Label>
            <div className="flex flex-wrap items-end gap-2">
              <Input
                id="endDateDate"
                type="date"
                className="w-[140px]"
                error={!!errors.endDateDate}
                {...register('endDateDate')}
              />
              <Select
                value={String(watch('endHour') ?? 12)}
                onValueChange={(v) => setValue('endHour', parseInt(v, 10))}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="Hr" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(watch('endMinute') ?? 0)}
                onValueChange={(v) => setValue('endMinute', parseInt(v, 10))}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 15, 30, 45].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n.toString().padStart(2, '0')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={watch('endAmPm') ?? 'PM'}
                onValueChange={(v) => setValue('endAmPm', v as 'AM' | 'PM')}
              >
                <SelectTrigger className="w-[72px]">
                  <SelectValue placeholder="AM/PM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(errors.endDateDate || errors.endHour) && (
              <p className="text-sm text-red-500">{errors.endDateDate?.message || errors.endHour?.message}</p>
            )}
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

