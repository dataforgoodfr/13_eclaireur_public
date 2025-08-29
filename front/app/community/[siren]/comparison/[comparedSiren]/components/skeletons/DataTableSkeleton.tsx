type DataTableSkeletonProps = {
  title: string;
};

export function DataTableSkeleton({ title }: DataTableSkeletonProps) {
  return (
    <div className='animate-pulse space-y-4'>
      {/* Section title */}
      <div className='flex items-center justify-between'>
        <div className='h-8 w-64 rounded bg-gray-200'>
          <span className='sr-only'>Chargement {title}...</span>
        </div>
        <div className='h-10 w-32 rounded bg-gray-200' />
      </div>

      {/* Comparison cards */}
      <div className='flex justify-around max-md:my-6 md:my-10'>
        <DataCardSkeleton />
        <DataCardSkeleton />
      </div>
    </div>
  );
}

function DataCardSkeleton() {
  return (
    <div className='w-64 space-y-4 rounded bg-gray-100 p-4'>
      {/* Header with total amount */}
      <div className='space-y-2'>
        <div className='h-6 w-32 rounded bg-gray-200' />
        <div className='h-8 w-20 rounded bg-blue-200' />
      </div>

      {/* Count */}
      <div className='space-y-2'>
        <div className='h-4 w-40 rounded bg-gray-200' />
        <div className='h-6 w-16 rounded bg-gray-300' />
      </div>

      {/* Data table entries */}
      <div className='space-y-2'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center justify-between rounded bg-gray-50 p-2'>
            <div className='space-y-1'>
              <div className='h-3 w-32 rounded bg-gray-200' />
              <div className='h-3 w-24 rounded bg-gray-200' />
            </div>
            <div className='h-4 w-16 rounded bg-gray-200' />
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className='mt-4 h-4 w-28 rounded bg-blue-200' />
    </div>
  );
}
