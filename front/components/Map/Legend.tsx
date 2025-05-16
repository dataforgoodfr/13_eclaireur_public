export default function ChoroplethLegend() {
  const grades = [
    { label: 'A', color: '#2ca02c' },
    { label: 'B', color: '#a1d99b' },
    { label: 'C', color: '#ffffb2' },
    { label: 'D', color: '#fdae6b' },
    { label: 'E', color: '#de2d26' },
  ];

  return (
    <div className='absolute left-4 top-4 z-20 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white/95 px-4 py-3 shadow-lg'>
      <div className='mb-1 font-semibold text-gray-700'>Score Legend</div>
      <div className='flex items-center gap-2'>
        {grades.map((g) => (
          <div key={g.label} className='flex flex-col items-center'>
            <div className='h-4 w-8 rounded' style={{ background: g.color }} title={g.label} />
            <span className='mt-1 text-xs font-medium text-gray-700'>{g.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
