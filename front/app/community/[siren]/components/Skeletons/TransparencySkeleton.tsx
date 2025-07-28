import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TransparencySkeleton() {
  return (
    <Card className="w-full p-6 bg-card rounded-2xl border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
        <div className="w-full lg:w-auto lg:flex-1 space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="w-full lg:w-auto lg:flex-1">
          <Skeleton className="h-64 sm:h-80 lg:h-full min-h-[300px] w-full" />
        </div>
      </div>
    </Card>
  );
}
