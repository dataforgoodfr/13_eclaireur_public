export function TransparencySkeleton() {
  return (
    <div className='animate-pulse space-y-4'>
      {/* Section title */}
      <div className='flex items-center justify-between'>
        <div className='h-8 w-64 rounded bg-gray-200' />
        <div className='h-10 w-32 rounded bg-gray-200' />
      </div>

      {/* Comparison cards */}
      <div className='flex justify-around max-md:my-6 md:my-10'>
        <TransparencyCardSkeleton />
        <TransparencyCardSkeleton />
      </div>
    </div>
  );
}

function TransparencyCardSkeleton() {
  return (
    <div className='w-64 space-y-4 rounded bg-gray-100 p-4'>
      {/* Score badges */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='h-4 w-32 rounded bg-gray-200' />
          <div className='h-8 w-8 rounded bg-green-200' />
        </div>
        <div className='h-4 w-24 rounded bg-gray-200' />

        <div className='flex items-center justify-between'>
          <div className='h-4 w-28 rounded bg-gray-200' />
          <div className='h-8 w-8 rounded bg-green-200' />
        </div>
        <div className='h-4 w-20 rounded bg-gray-200' />
      </div>
    </div>
  );
}
