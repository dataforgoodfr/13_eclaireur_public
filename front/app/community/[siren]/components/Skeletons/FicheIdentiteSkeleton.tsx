import type { Community } from '#app/models/community';
import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { Card, CardContent, CardHeader } from '#components/ui/card';
import { Info } from 'lucide-react';

import { CommunityDetails } from '../CommunityDetails';

export function FicheIdentiteSkeleton() {
  return (
    <Card className='>border-muted-DEFAULT rounded-3xl border bg-card p-4 text-card-foreground shadow-none md:p-8'>
      <CardHeader className='p-0 pb-8'>
        {/* Header - Show static title, skeleton for badge */}
        <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
          <div className='order-2 sm:order-1'>
            <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>
              Informations générales
            </h2>
          </div>
          <div className='order-1 mb-2 sm:order-2 sm:mb-0 md:mb-4'>
            <BadgeCommunity
              text=''
              icon={Info}
              iconSize={12}
              className='w-72 animate-pulse bg-gradient-to-br from-brand-2 from-10% via-red-200/60 via-50% to-red-200 to-90% md:w-96'
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        {/* Communitytdetail */}
        <div className='flex w-full flex-col gap-6 md:flex-row'>
          <div className='order-2 w-full md:order-1 md:w-1/3'>
            <CommunityDetails
              community={
                {
                  population: 0,
                  superficie_ha: 0,
                  tranche_effectif: 0,
                } as Community
              }
            />
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
      </CardContent>
    </Card>
  );
}
