import { Skeleton } from '#components/ui/skeleton';

type MarchesPublicsMobileSkeletonProps = {
  rows?: number;
};

export default function MarchesPublicsMobileSkeleton({
  rows = 4,
}: MarchesPublicsMobileSkeletonProps) {
  return (
    <div className='block w-full space-y-3 self-stretch md:hidden'>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className='min-h-[200px] w-full rounded-lg bg-muted-light p-4'>
          {/* Badges skeleton */}
          <div className='mb-2.5 flex flex-wrap gap-1'>
            {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, badgeIndex) => (
              <Skeleton key={badgeIndex} className='h-6 w-[80px] rounded-full' />
            ))}
          </div>

          {/* Title skeleton */}
          <div className='mb-2.5'>
            <Skeleton className='mb-2 h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </div>

          {/* Separator */}
          <div className='mb-2.5 border-b border-muted-border' />

          {/* Montant skeleton */}
          <div className='mb-2.5 flex items-center justify-between'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-5 w-24' />
          </div>

          {/* Separator */}
          <div className='mb-2.5 border-b border-muted-border' />

          {/* Année skeleton */}
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
      ))}
    </div>
  );
}
