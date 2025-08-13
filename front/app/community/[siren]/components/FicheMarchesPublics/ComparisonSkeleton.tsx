'use client';

import { Button } from '#components/ui/button';
import { Skeleton } from '#components/ui/skeleton';
import { Download } from 'lucide-react';

type ComparisonProps = {
  siren: string;
};

type ComparisonData = {
  year: string;
  community: number;
  communityLabel: string;
  regional: number;
  regionalLabel: string;
};

// Skeleton component using shadcn-ui
export function ComparisonSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <div className="space-y-2">
      <div className={`flex items-center ${isMobile ? 'flex-col gap-4' : 'justify-between'}`}>
        <div className={isMobile ? 'text-center' : ''}>
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

      {isMobile ? (
        <div className="bg-white rounded-lg p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="text-center">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="w-full h-6" />
                  <Skeleton className="w-full h-6" />
                </div>
              </div>
            ))}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
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
