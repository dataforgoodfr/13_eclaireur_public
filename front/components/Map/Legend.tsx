export default function ChoroplethLegend({
  populationMinMax,
  selectedRangeOption,
}: {
  populationMinMax: { min: number; max: number };
  selectedRangeOption: string;
}) {
  const grades = [
    { label: 'A', color: '#1976d2' }, // strong blue
    { label: 'B', color: '#64b5f6' }, // light blue
    { label: 'C', color: '#b2dfdb' }, // soft teal
    { label: 'D', color: '#ffe082' }, // soft yellow
    { label: 'E', color: '#ffb74d' }, // soft orange
  ];
  console.log(populationMinMax);
  return (
    <div className='absolute left-4 top-4 z-20 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white/95 px-4 py-3 shadow-lg'>
      <div>
        <div className='mb-1 font-semibold text-gray-700'>Score Légende</div>
        <div className='flex items-center gap-2'>
          {grades.map((g) => (
            <div key={g.label} className='flex flex-col items-center'>
              <div className='h-4 w-8 rounded' style={{ background: g.color }} title={g.label} />
              <span className='mt-1 text-xs font-medium text-gray-700'>{g.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className='mb-1 font-semibold capitalize text-gray-700'>
          {selectedRangeOption} Légende
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>{populationMinMax.min}</span>
          <span className='text-sm text-gray-600'>-</span>
          <span className='text-sm text-gray-600'>{populationMinMax.max}</span>
        </div>
      </div>
    </div>
  );
}
