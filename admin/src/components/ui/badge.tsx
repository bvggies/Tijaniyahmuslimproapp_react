import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200',
        secondary:
          'bg-secondary text-secondary-foreground',
        destructive:
          'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200',
        success:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
        warning:
          'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
        info:
          'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
        outline:
          'border border-current bg-transparent',
        glass:
          'bg-white/20 text-white backdrop-blur-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

