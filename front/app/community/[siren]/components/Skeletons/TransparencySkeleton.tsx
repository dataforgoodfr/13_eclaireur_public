import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TransparencySkeleton() {
  return (
    <Card className='w-full rounded-2xl border border-border bg-card p-6'>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-8 w-48' />
      </div>
      <div className='flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-start'>
        <div className='w-full space-y-4 lg:w-auto lg:flex-1'>
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-24 w-full' />
        </div>
        <div className='w-full lg:w-auto lg:flex-1'>
          <Skeleton className='h-64 min-h-[300px] w-full sm:h-80 lg:h-full' />
        </div>
      </div>
    </Card>
  );
}
