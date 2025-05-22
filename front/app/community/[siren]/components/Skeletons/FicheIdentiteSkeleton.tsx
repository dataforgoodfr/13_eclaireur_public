import { Skeleton } from '@/components/ui/skeleton';

export function FicheIdentiteSkeleton() {
  return (
    <div className='grid grid-cols-4 gap-4'>
      <div className='col-span-2 space-y-4'>
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-11 w-full' />
        <Skeleton className='h-11 w-full' />
      </div>
      <Skeleton className='col-span-2 h-[400px] w-full' />
      <Skeleton className='col-span-2 col-start-2 h-[214px]' />
    </div>
  );
}
