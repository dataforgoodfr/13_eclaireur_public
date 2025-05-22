import { TableCell } from '@/components/ui/table';

type PercentageBarCellProps = {
  /** Percentage value from 0 to 100 */
  value: number;
};

export default function PercentageBarCell({ value }: PercentageBarCellProps) {
  return (
    <TableCell>
      <div className='relative h-[14px] w-full rounded-md bg-gray-300'>
        <div className='h-[14px] rounded-md bg-gray-600' style={{ width: `${value}%` }}></div>
      </div>
    </TableCell>
  );
}
