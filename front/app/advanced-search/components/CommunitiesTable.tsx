'use client';

import { AdvancedSearchCommunity } from '@/app/models/community';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/utils/utils';

import { usePaginationFromSearchParams } from '../hooks/usePaginationFromSearchParams';
import { Pagination } from './Pagination';

type CommunitiesTableProps = {
  communities: AdvancedSearchCommunity[];
};

export function CommunitiesTable({ communities }: CommunitiesTableProps) {
  const { pagination, setPage } = usePaginationFromSearchParams();

  const totalPage = Math.ceil(communities[0].total_row_count / pagination.limit);

  return (
    <div className='flex flex-col items-center'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Collectivité</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className='text-right'>Population</TableHead>
            <TableHead className='text-right'>Budget total</TableHead>
            <TableHead>Score Marchés Publics</TableHead>
            <TableHead>Score Subventions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((community) => (
            <TableRow key={community.siren + community.type}>
              <TableCell className='font-medium'>{community.nom}</TableCell>
              <TableCell>{community.type}</TableCell>
              <TableCell className='text-right'>{formatNumber(community.population)}</TableCell>
              <TableCell className='text-right'>TODO</TableCell>
              <TableCell>TODO</TableCell>
              <TableCell>TODO</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPage={totalPage} activePage={pagination.page} onPageChange={setPage} />
    </div>
  );
}
