import { Skeleton } from '#components/ui/skeleton';

import { CHART_HEIGHT } from './constants';

type ChartSkeletonProps = {
  style?: React.CSSProperties;
};

export function ChartSkeleton({ style }: ChartSkeletonProps) {
  const bars = Array.from({ length: 8 }, (_, i) => {
    // Hauteurs variables pour simuler des données réelles
    const heights = [60, 80, 45, 120, 90, 70, 100, 55];
    return heights[i];
  });

  return (
    <div className='w-full' style={{ height: CHART_HEIGHT, ...style }}>
      {/* Légende skeleton */}
      <div className='mb-6 flex justify-center'>
        <Skeleton className='h-6 w-64' />
      </div>

      {/* Graphique skeleton */}
      <div className='flex h-full items-end justify-between gap-2 px-4 pb-12'>
        {bars.map((height, index) => (
          <div key={index} className='flex max-w-16 flex-1 flex-col items-center'>
            {/* Label au-dessus de la barre */}
            <Skeleton className='mb-2 h-4 w-12' />

            {/* Barre avec hauteur variable */}
            <Skeleton className='w-full rounded-t-2xl' style={{ height: `${height}px` }} />

            {/* Année en bas */}
            <Skeleton className='mt-2 h-4 w-10' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChartSkeleton;
