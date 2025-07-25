import { Skeleton } from '#components/ui/skeleton';

export function FicheMarchesPublicsSkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-11 w-full' />
      <Skeleton className='h-11 w-full' />
      <Skeleton className='h-[600px] w-full' />
    </div>
  );
}
