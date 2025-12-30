import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-primary-100 dark:bg-primary-800',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

