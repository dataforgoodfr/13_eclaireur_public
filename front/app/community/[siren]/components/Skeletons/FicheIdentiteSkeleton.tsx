import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { Card } from '#components/ui/card';
import { Skeleton } from '#components/ui/skeleton';
import { CircleX } from 'lucide-react';

export function FicheIdentiteSkeleton() {
  return (
    <Card className="w-full p-6 bg-card rounded-2xl border border-border">
      {/* Header - Show static title, skeleton for badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="order-2 sm:order-1">
          <h2 className="text-3xl font-extrabold md:text-4xl text-primary">
            Informations générales
          </h2>
        </div>
        <div className="order-1 sm:order-2">
          <BadgeCommunity
            text=""
            icon={CircleX}
            iconSize={12}
            className="bg-gray-200"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-6 md:flex-row">
        {/* Info blocks - Show static labels, skeleton for values */}
        <div className="order-2 w-full md:order-1 md:w-1/3">
          <div className="flex flex-col gap-4 w-full">
            <InfoBlockSkeleton
              label="Population"
              unit="habitants"
              bgColor="bg-yellow-100"
            />
            <InfoBlockSkeleton
              label="Superficie"
              unit="hectares"
              bgColor="bg-lime-100"
            />
            <InfoBlockSkeleton
              label="Nombre d'agents administratifs"
              unit="agents"
              bgColor="bg-indigo-100"
            />
          </div>
        </div>

        {/* Map skeleton */}
        <div className="w-full md:w-2/3 h-64 rounded-lg md:h-auto order-1 md:order-2">
          <div className="relative w-full h-64 md:h-auto bg-gradient-to-br from-green-100 via-blue-50 to-green-200 rounded-lg overflow-hidden">
            {/* Fake map elements */}
            <div className="absolute top-4 left-4 w-8 h-6 bg-blue-300 rounded opacity-60 blur-sm" />
            <div className="absolute top-12 right-8 w-6 h-8 bg-green-300 rounded opacity-50 blur-sm" />
            <div className="absolute bottom-8 left-12 w-12 h-4 bg-blue-200 rounded opacity-70 blur-sm" />
            <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-400 rounded-full opacity-40 blur-sm" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-400 rounded-full opacity-80 blur-sm" />
            {/* Road-like lines */}
            <div className="absolute top-8 left-0 w-full h-0.5 bg-gray-400 opacity-30 blur-sm rotate-12" />
            <div className="absolute bottom-12 left-0 w-full h-0.5 bg-gray-400 opacity-30 blur-sm -rotate-6" />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoBlockSkeleton({
  label,
  unit,
  bgColor = 'bg-gray-100'
}: {
  label: string;
  unit?: string;
  bgColor?: string;
}) {
  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-3 text-primary ${bgColor}`}>
      <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2 sm:gap-1">
        {/* Static label - show immediately */}
        <p className="text-base font-medium">{label}</p>
        {/* Dynamic value - skeleton with exact styling match */}
        <h4 className='text-lg font-bold'>
          <Skeleton className="h-6 w-16 inline-block" />
          {unit && <span className='hidden sm:inline ml-1 text-base font-normal'>{unit}</span>}
        </h4>
      </div>
    </div>
  );
}
