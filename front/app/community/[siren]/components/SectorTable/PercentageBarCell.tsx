import { TableCell } from '#components/ui/table';

type PercentageBarCellProps = {
  /** Percentage value from 0 to 100 */
  value: number;
  /** Type of data for color coding */
  type?: 'marches-publics' | 'subventions';
};

export default function PercentageBarCell({
  value,
  type = 'marches-publics',
}: PercentageBarCellProps) {
  // Determine color segments based on percentage value
  const getSegmentedBarColor = () => {
    if (type === 'marches-publics') {
      // Primary colors divided by 20% segments
      if (value <= 20) return 'bg-primary-400';
      if (value <= 40) return 'bg-primary-500';
      if (value <= 60) return 'bg-primary-600';
      if (value <= 80) return 'bg-primary-600';
      return 'bg-primary-700';
    }
    // Subventions - using brand-3 variations
    if (value <= 20) return 'bg-brand-3/20';
    if (value <= 40) return 'bg-brand-3/40';
    if (value <= 60) return 'bg-brand-3/60';
    if (value <= 80) return 'bg-brand-3/80';
    return 'bg-brand-3';
  };

  const textColorClass = type === 'subventions' ? 'text-brand-3' : 'text-primary';

  return (
    <TableCell className='text-right'>
      <div className='flex items-center justify-end gap-2'>
        <div className='relative h-[14px] w-[300px] rounded-md border border-gray-300 bg-gray-100'>
          <div
            className={`h-[13px] rounded-sm transition-colors ${getSegmentedBarColor()}`}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className={`w-[40px] text-right font-semibold ${textColorClass}`}>
          {Math.round(value)}
        </span>
      </div>
    </TableCell>
  );
}
