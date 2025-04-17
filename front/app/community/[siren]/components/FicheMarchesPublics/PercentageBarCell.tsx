import { TableCell } from '@/components/ui/table';

export default function PercentageBarCell({ value }: { value: number }) {
  return (
    <TableCell>
      <div className='relative h-2 w-full rounded-md'>
        <div className='h-2 rounded-md bg-blue-500' style={{ width: `${value}%` }}></div>
      </div>
    </TableCell>
  );
}
