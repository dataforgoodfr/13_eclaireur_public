import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { Card } from '#components/ui/card';
import { Skeleton } from '#components/ui/skeleton';
import { CircleX } from 'lucide-react';

export function FicheIdentiteSkeleton() {
  return (
    <Card className='w-full rounded-2xl border border-border bg-card p-6'>
      {/* Header - Show static title, skeleton for badge */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='order-2 sm:order-1'>
          <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>
            Informations générales
          </h2>
        </div>
        <div className='order-1 sm:order-2'>
          <BadgeCommunity text='' icon={CircleX} iconSize={12} className='bg-gray-200' />
        </div>
      </div>

      <div className='flex w-full flex-col gap-6 md:flex-row'>
        {/* Info blocks - Show static labels, skeleton for values */}
        <div className='order-2 w-full md:order-1 md:w-1/3'>
          <div className='flex w-full flex-col gap-4'>
            <InfoBlockSkeleton label='Population' unit='habitants' bgColor='bg-brand-3' />
            <InfoBlockSkeleton label='Superficie' unit='hectares' bgColor='bg-brand-3' />
            <InfoBlockSkeleton
              label="Nombre d'agents administratifs"
              unit='agents'
              bgColor='bg-brand-3'
            />
          </div>
        </div>

        {/* Map skeleton */}
        <div className='order-1 h-64 w-full rounded-lg md:order-2 md:h-auto md:w-2/3'>
          <div className='relative h-64 w-full overflow-hidden rounded-lg bg-gradient-to-br from-green-100 via-blue-50 to-green-200 md:h-auto'>
            {/* Fake map elements */}
            <div className='absolute left-4 top-4 h-6 w-8 rounded bg-blue-300 opacity-60 blur-sm' />
            <div className='absolute right-8 top-12 h-8 w-6 rounded bg-green-300 opacity-50 blur-sm' />
            <div className='absolute bottom-8 left-12 h-4 w-12 rounded bg-blue-200 opacity-70 blur-sm' />
            <div className='absolute bottom-4 right-4 h-8 w-8 rounded-full bg-green-400 opacity-40 blur-sm' />
            <div className='absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-red-400 opacity-80 blur-sm' />
            {/* Road-like lines */}
            <div className='absolute left-0 top-8 h-0.5 w-full rotate-12 bg-gray-400 opacity-30 blur-sm' />
            <div className='absolute bottom-12 left-0 h-0.5 w-full -rotate-6 bg-gray-400 opacity-30 blur-sm' />
            {/* Shimmer overlay */}
            <div className='absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent' />
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoBlockSkeleton({
  label,
  unit,
  bgColor = 'bg-gray-100',
}: {
  label: string;
  unit?: string;
  bgColor?: string;
}) {
  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-3 text-primary ${bgColor}`}>
      <div className='flex flex-row items-center justify-between gap-2 sm:flex-col sm:items-start sm:justify-start sm:gap-1'>
        {/* Static label - show immediately */}
        <p className='text-base font-medium'>{label}</p>
        {/* Dynamic value - skeleton with exact styling match */}
        <h4 className='text-lg font-bold'>
          <Skeleton className='inline-block h-6 w-16' />
          {unit && <span className='ml-1 hidden text-base font-normal sm:inline'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}
