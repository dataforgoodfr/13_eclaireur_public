import { Skeleton } from '#components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';

type MarchesPublicsTableSkeletonProps = {
  rows?: number;
};

export default function MarchesPublicsTableSkeleton({ rows = 10 }: MarchesPublicsTableSkeletonProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[300px]'>Titulaire</TableHead>
          <TableHead className=''>Objet</TableHead>
          <TableHead className='w-[140px] text-right'>Montant (€)</TableHead>
          <TableHead className='w-[140px] text-right'>Année</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className='flex flex-wrap gap-1'>
                {/* Random number of badge skeletons (1-3) */}
                {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, badgeIndex) => (
                  <Skeleton 
                    key={badgeIndex}
                    className='h-6  w-[80px] rounded-full'
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className='h-4 w-full max-w-[400px]' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='h-4 w-20 ml-auto' />
            </TableCell>
            <TableCell className='text-right'>
              <Skeleton className='h-4 w-12 ml-auto' />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}