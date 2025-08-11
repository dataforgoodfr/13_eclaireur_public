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
      <div className='flex items-end justify-between h-full px-4 pb-12 gap-2'>
        {bars.map((height, index) => (
          <div key={index} className='flex flex-col items-center flex-1 max-w-16'>
            {/* Label au-dessus de la barre */}
            <Skeleton className='h-4 w-12 mb-2' />
            
            {/* Barre avec hauteur variable */}
            <Skeleton 
              className='w-full rounded-t-2xl' 
              style={{ height: `${height}px` }} 
            />
            
            {/* Année en bas */}
            <Skeleton className='h-4 w-10 mt-2' />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChartSkeleton;