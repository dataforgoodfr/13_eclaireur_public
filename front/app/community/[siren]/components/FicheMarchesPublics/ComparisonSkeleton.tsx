'use client';

import { Button } from '#components/ui/button';
import { Skeleton } from '#components/ui/skeleton';
import { Download } from 'lucide-react';

// Skeleton component using shadcn-ui
export function ComparisonSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="space-y-2">
      {/* Only show header skeleton on desktop - mobile uses TabHeader */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-7 w-72" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-12 w-32 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none" />
            <Button
              disabled
              className="h-12 w-12 bg-primary rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isMobile ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="space-y-1 p-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-2 py-1 min-w-0">
                <div className="w-10 flex-shrink-0">
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-[60px] relative">
                    {/* Primary bar skeleton */}
                    <div className="absolute top-2">
                      <Skeleton className="h-6 w-32 rounded-r" />
                      <div className="absolute right-[-50px] top-0">
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                    {/* Secondary bar skeleton */}
                    <div className="absolute top-8">
                      <Skeleton className="h-6 w-24 rounded-r" />
                      <div className="absolute right-[-40px] top-0">
                        <Skeleton className="h-4 w-10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6">
          <div className="h-[550px] flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex justify-between items-end px-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <Skeleton className="w-12" style={{ height: `${Math.random() * 200 + 100}px` }} />
                    <Skeleton className="h-3 w-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg p-4">
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
