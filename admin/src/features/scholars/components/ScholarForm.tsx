import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon, MapPin, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Scholar } from '../../../lib/api/types';

const scholarSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameArabic: z.string().optional(),
  title: z.string().optional(),
  biography: z.string().optional(),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  birthYear: z.union([z.number().int().min(500).max(2100), z.literal('')]).optional(),
  deathYear: z.union([z.number().int().min(500).max(2100), z.literal('')]).optional(),
  location: z.string().optional(),
  specialty: z.string().optional(),
  isAlive: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

type ScholarFormData = z.infer<typeof scholarSchema>;

interface ScholarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Scholar>) => void;
  scholar?: Scholar | null;
  isLoading?: boolean;
}

export function ScholarForm({ open, onClose, onSubmit, scholar, isLoading }: ScholarFormProps) {
  const isEditing = Boolean(scholar);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScholarFormData>({
    resolver: zodResolver(scholarSchema),
    defaultValues: scholar
      ? {
          name: scholar.name,
          nameArabic: scholar.nameArabic || '',
          title: scholar.title || '',
          biography: scholar.biography || '',
          imageUrl: scholar.imageUrl || '',
          birthYear: scholar.birthYear || undefined,
          deathYear: scholar.deathYear || undefined,
          location: scholar.location || '',
          specialty: scholar.specialty || '',
          isAlive: scholar.isAlive,
          isPublished: scholar.isPublished,
          sortOrder: scholar.sortOrder || 0,
        }
      : {
          isAlive: true,
          isPublished: false,
          sortOrder: 0,
        },
  });

  // Watch isAlive to control deathYear field
  const isAlive = watch('isAlive');

  React.useEffect(() => {
    if (scholar) {
      reset({
        name: scholar.name,
        nameArabic: scholar.nameArabic || '',
        title: scholar.title || '',
        biography: scholar.biography || '',
        imageUrl: scholar.imageUrl || '',
        birthYear: scholar.birthYear || undefined,
        deathYear: scholar.deathYear || undefined,
        location: scholar.location || '',
        specialty: scholar.specialty || '',
        isAlive: scholar.isAlive,
        isPublished: scholar.isPublished,
        sortOrder: scholar.sortOrder || 0,
      });
    } else {
      reset({
        name: '',
        nameArabic: '',
        title: '',
        biography: '',
        imageUrl: '',
        birthYear: undefined,
        deathYear: undefined,
        location: '',
        specialty: '',
        isAlive: true,
        isPublished: false,
        sortOrder: 0,
      });
    }
  }, [scholar, reset]);

  const handleFormSubmit = (data: ScholarFormData) => {
    const scholarData: Partial<Scholar> = {
      name: data.name,
      nameArabic: data.nameArabic || undefined,
      title: data.title || undefined,
      biography: data.biography || undefined,
      imageUrl: data.imageUrl || undefined,
      birthYear: data.birthYear || undefined,
      // Only include deathYear if scholar is not alive
      deathYear: data.isAlive ? undefined : (data.deathYear || undefined),
      location: data.location || undefined,
      specialty: data.specialty || undefined,
      isAlive: data.isAlive !== undefined ? data.isAlive : true,
      isPublished: data.isPublished || false,
      sortOrder: data.sortOrder || 0,
    };
    onSubmit(scholarData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Scholar' : 'Create New Scholar'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the scholar details below'
              : 'Fill in the details to create a new scholar profile'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter scholar name"
              error={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Name Arabic */}
          <div className="space-y-2">
            <Label htmlFor="nameArabic">Name (Arabic)</Label>
            <Input
              id="nameArabic"
              placeholder="الاسم بالعربية"
              dir="rtl"
              {...register('nameArabic')}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Sheikh, Imam, Scholar"
              {...register('title')}
            />
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <Label htmlFor="biography">Biography</Label>
            <textarea
              id="biography"
              placeholder="Enter scholar biography..."
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('biography')}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Profile Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
          </div>

          {/* Location & Specialty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
                {...register('location')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input
                id="specialty"
                placeholder="e.g., Tafsir, Hadith, Fiqh"
                {...register('specialty')}
              />
            </div>
          </div>

          {/* Birth Year & Death Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthYear" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Birth Year
              </Label>
              <Input
                id="birthYear"
                type="number"
                placeholder="e.g., 1950"
                {...register('birthYear', { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathYear" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Death Year {isAlive && <span className="text-xs text-muted-foreground">(disabled if alive)</span>}
              </Label>
              <Input
                id="deathYear"
                type="number"
                placeholder="e.g., 2020"
                disabled={isAlive}
                {...register('deathYear', { 
                  valueAsNumber: true,
                  onChange: (e) => {
                    // Clear death year if scholar is alive
                    if (isAlive) {
                      setValue('deathYear', undefined);
                    }
                  }
                })}
              />
              {isAlive && (
                <p className="text-xs text-muted-foreground">
                  Death year is disabled because the scholar is marked as alive
                </p>
              )}
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              placeholder="0"
              {...register('sortOrder', { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first in listings
            </p>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAlive"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...register('isAlive', {
                  onChange: (e) => {
                    const checked = e.target.checked;
                    setValue('isAlive', checked);
                    // Clear death year when marking as alive
                    if (checked) {
                      setValue('deathYear', undefined);
                    }
                  }
                })}
              />
              <Label htmlFor="isAlive" className="font-normal">
                Is Alive
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...register('isPublished')}
              />
              <Label htmlFor="isPublished" className="font-normal">
                Publish (make visible to users)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Scholar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

