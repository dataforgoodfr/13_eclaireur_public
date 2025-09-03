'use client';

import { Button } from '#components/ui/button';
import { Skeleton } from '#components/ui/skeleton';
import { Download } from 'lucide-react';

// Skeleton component using shadcn-ui
export function ComparisonSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className='space-y-2'>
      {/* Only show header skeleton on desktop - mobile uses TabHeader */}
      {!isMobile && (
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-7 w-72' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-12 w-32 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none' />
            <Button
              disabled
              className='h-12 w-12 rounded-bl-none rounded-br-lg rounded-tl-lg rounded-tr-none bg-primary'
            >
              <Download className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className='overflow-hidden rounded-lg bg-white'>
          <div className='space-y-1 overflow-x-auto p-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className='flex min-w-0 items-center gap-2 py-1'>
                <div className='w-10 flex-shrink-0'>
                  <Skeleton className='h-4 w-8' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='relative h-[60px]'>
                    {/* Primary bar skeleton */}
                    <div className='absolute top-2'>
                      <Skeleton className='h-6 w-32 rounded-r' />
                      <div className='absolute right-[-50px] top-0'>
                        <Skeleton className='h-4 w-12' />
                      </div>
                    </div>
                    {/* Secondary bar skeleton */}
                    <div className='absolute top-8'>
                      <Skeleton className='h-6 w-24 rounded-r' />
                      <div className='absolute right-[-40px] top-0'>
                        <Skeleton className='h-4 w-10' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='rounded-lg bg-white p-6'>
          <div className='flex h-[550px] items-center justify-center'>
            <div className='w-full space-y-4'>
              <div className='flex items-end justify-between px-10'>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className='flex flex-col items-center space-y-2'>
                    <Skeleton
                      className='w-12'
                      style={{ height: `${Math.random() * 200 + 100}px` }}
                    />
                    <Skeleton className='h-3 w-10' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='rounded-lg bg-white p-4'>
        <div className='flex flex-wrap justify-center gap-6'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-32' />
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-4' />
            <Skeleton className='h-4 w-36' />
          </div>
        </div>
      </div>
    </div>
  );
}
