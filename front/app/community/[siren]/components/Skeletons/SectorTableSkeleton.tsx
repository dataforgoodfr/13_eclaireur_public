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
                <Skeleton className='h-3 bg-score-transparency-2 rounded-tl-br' style={{ width: `${Math.random() * 80 + 20}%` }} />
              </div>
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='h-4 w-12 ml-auto' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='h-4 w-16 ml-auto' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}