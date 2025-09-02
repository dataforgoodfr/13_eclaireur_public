export default function Loading() {
  return (
    <div className='animate-pulse'>
      {/* Header skeleton */}
      <div className='mb-6 h-32 w-full bg-gray-200' />

      <div className='mx-5 mx-auto my-3 max-w-screen-xl space-y-8'>
        {/* Header comparison skeleton */}
        <div className='flex justify-around'>
          <div className='h-32 w-64 rounded bg-gray-100 p-3' />
          <div className='h-32 w-64 rounded bg-gray-100 p-3' />
        </div>

        {/* Transparency section skeleton */}
        <div className='space-y-4'>
          <div className='h-12 w-1/3 rounded bg-gray-200' />
          <div className='flex justify-around'>
            <div className='h-48 w-64 rounded bg-gray-100 p-4' />
            <div className='h-48 w-64 rounded bg-gray-100 p-4' />
          </div>
        </div>

        {/* Data sections skeleton */}
        <div className='space-y-8'>
          <div className='space-y-4'>
            <div className='h-12 w-1/3 rounded bg-gray-200' />
            <div className='flex justify-around'>
              <div className='h-96 w-64 rounded bg-gray-100 p-4' />
              <div className='h-96 w-64 rounded bg-gray-100 p-4' />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='h-12 w-1/3 rounded bg-gray-200' />
            <div className='flex justify-around'>
              <div className='h-96 w-64 rounded bg-gray-100 p-4' />
              <div className='h-96 w-64 rounded bg-gray-100 p-4' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
