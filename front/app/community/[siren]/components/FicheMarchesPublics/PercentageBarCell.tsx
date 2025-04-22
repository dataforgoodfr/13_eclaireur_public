import { TableCell } from '@/components/ui/table';

export default function PercentageBarCell({ value }: { value: number }) {
  return (
    <TableCell>
      <div className='relative h-[14px] w-full rounded-md bg-gray-300'>
        <div className='h-[14px] rounded-md bg-gray-600' style={{ width: `${value}%` }}></div>
      </div>
    </TableCell>
  );
}
