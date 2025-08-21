import { Skeleton } from '#components/ui/skeleton';

type MarchesPublicsMobileSkeletonProps = {
  rows?: number;
};

export default function MarchesPublicsMobileSkeleton({ rows = 4 }: MarchesPublicsMobileSkeletonProps) {
  return (
    <div className="block md:hidden space-y-3 w-full self-stretch">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-muted-light rounded-lg p-4 w-full min-h-[200px]">
          {/* Badges skeleton */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, badgeIndex) => (
              <Skeleton 
                key={badgeIndex}
                className='h-6 w-[80px] rounded-full'
              />
            ))}
          </div>
          
          {/* Title skeleton */}
          <div className="mb-2.5">
            <Skeleton className='h-4 w-full mb-2' />
            <Skeleton className='h-4 w-3/4' />
          </div>
          
          {/* Separator */}
          <div className="border-b border-muted-border mb-2.5" />
          
          {/* Montant skeleton */}
          <div className="flex justify-between items-center mb-2.5">
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-5 w-24' />
          </div>
          
          {/* Separator */}
          <div className="border-b border-muted-border mb-2.5" />
          
          {/* Année skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
      ))}
    </div>
  );
}