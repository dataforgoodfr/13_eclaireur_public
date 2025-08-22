import { Skeleton } from '#components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';

type SectorTableSkeletonProps = {
  rows?: number;
};

export default function SectorTableSkeleton({ rows = 8 }: SectorTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[400px]'>Secteur</TableHead>
          <TableHead></TableHead>
          <TableHead className='w-[80px] text-right'>Part (%)</TableHead>
          <TableHead className='w-[100px] text-right'>Montant (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className='font-medium'>
              <Skeleton className='h-4 w-80' />
            </TableCell>
            <TableCell>
              <div className='flex items-center'>
                <Skeleton
                  className='bg-score-transparency-2 h-3 rounded-tl-br'
                  style={{ width: `${Math.random() * 80 + 20}%` }}
                />
              </div>
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='ml-auto h-4 w-12' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='ml-auto h-4 w-16' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
