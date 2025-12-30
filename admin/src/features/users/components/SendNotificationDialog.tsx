import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Bell, Send, Users, Clock, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
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
import { User, NotificationTargetType, NotificationTrigger } from '../../../lib/api/types';
import { toast } from '../../../components/ui/use-toast';
import { userCategories } from '../hooks/useUsers';

const notificationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  body: z.string().min(10, 'Body must be at least 10 characters').max(500),
  imageUrl: z.union([z.string().url(), z.literal('')]).optional(),
  actionUrl: z.union([z.string().url(), z.literal('')]).optional(),
  schedule: z.enum(['now', 'later']),
  scheduledAt: z.string().optional(),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

interface SendNotificationDialogProps {
  open: boolean;
  onClose: () => void;
  targetUsers: User[];
  categoryFilter?: string;
}

const notificationTemplates = [
  {
    id: 'welcome',
    name: 'Welcome Message',
    title: 'Welcome to Tijaniyah Muslim Pro! 🌙',
    body: 'Assalamu Alaikum! We\'re thrilled to have you join our community. Start your spiritual journey today with daily prayers, dhikr, and more.',
  },
  {
    id: 'prayer_reminder',
    name: 'Prayer Reminder',
    title: 'Time for Prayer 🕌',
    body: 'It\'s time for your next prayer. May Allah accept your prayers and bless your day.',
  },
  {
    id: 'streak_reminder',
    name: 'Streak Reminder',
    title: 'Don\'t break your streak! 🔥',
    body: 'You\'ve been doing great with your daily prayers. Keep it up and maintain your streak!',
  },
  {
    id: 'inactive_reminder',
    name: 'We Miss You',
    title: 'We Miss You! 💚',
    body: 'It\'s been a while since we saw you. Come back and continue your spiritual journey with us.',
  },
  {
    id: 'new_content',
    name: 'New Content',
    title: 'New Lessons Available 📚',
    body: 'We\'ve added new lessons and content to help you on your path. Check them out now!',
  },
  {
    id: 'event_reminder',
    name: 'Event Reminder',
    title: 'Upcoming Event 📅',
    body: 'Don\'t miss our upcoming community event! Join us for an enriching experience.',
  },
  {
    id: 'ramadan',
    name: 'Ramadan Special',
    title: 'Ramadan Mubarak! 🌙',
    body: 'May this blessed month bring you peace, joy, and countless blessings. Let\'s make the most of it together.',
  },
  {
    id: 'custom',
    name: 'Custom Message',
    title: '',
    body: '',
  },
];

export function SendNotificationDialog({
  open,
  onClose,
  targetUsers,
  categoryFilter,
}: SendNotificationDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      schedule: 'now',
    },
  });

  const schedule = watch('schedule');

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = notificationTemplates.find((t) => t.id === templateId);
    if (template) {
      setValue('title', template.title);
      setValue('body', template.body);
    }
  };

  const getTargetDescription = (): string => {
    if (targetUsers.length === 1) {
      return `Send to ${targetUsers[0].name}`;
    }
    
    if (categoryFilter && categoryFilter !== 'all') {
      const category = userCategories.find(c => c.value === categoryFilter);
      return `Send to ${targetUsers.length} ${category?.label || 'users'}`;
    }
    
    return `Send to ${targetUsers.length} users`;
  };

  const onSubmit = async (data: NotificationFormData) => {
    setIsSending(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(
      'Notification sent!',
      `Successfully sent to ${targetUsers.length} user${targetUsers.length > 1 ? 's' : ''}`
    );
    
    setIsSending(false);
    reset();
    setSelectedTemplate('custom');
    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedTemplate('custom');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary-500" />
            Send Notification
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {getTargetDescription()}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Target Preview */}
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-sm font-medium mb-2">Recipients:</p>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {targetUsers.slice(0, 10).map((user) => (
                <Badge key={user.id} variant="secondary" className="text-xs">
                  {user.name}
                </Badge>
              ))}
              {targetUsers.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{targetUsers.length - 10} more
                </Badge>
              )}
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {notificationTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Notification title"
              error={!!errors.title}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message *</Label>
            <textarea
              id="body"
              placeholder="Notification message..."
              className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('body')}
            />
            {errors.body && (
              <p className="text-sm text-red-500">{errors.body.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {watch('body')?.length || 0}/500 characters
            </p>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Image URL (optional)
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
          </div>

          {/* Action URL */}
          <div className="space-y-2">
            <Label htmlFor="actionUrl" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Action URL (optional)
            </Label>
            <Input
              id="actionUrl"
              placeholder="https://app.tijaniyah.com/..."
              {...register('actionUrl')}
            />
            <p className="text-xs text-muted-foreground">
              Deep link to open when user taps notification
            </p>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              When to send
            </Label>
            <Select
              value={schedule}
              onValueChange={(v) => setValue('schedule', v as 'now' | 'later')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Send Now</SelectItem>
                <SelectItem value="later">Schedule for Later</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {schedule === 'later' && (
            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Scheduled Time</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                {...register('scheduledAt')}
              />
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSending}>
              <Send className="h-4 w-4 mr-2" />
              {schedule === 'now' ? 'Send Now' : 'Schedule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

