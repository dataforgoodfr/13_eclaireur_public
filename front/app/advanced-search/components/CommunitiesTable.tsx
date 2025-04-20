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
import { formatNumber, stringifyCommunityType } from '@/utils/utils';

import { AdvancedSearchOrder, useOrderParams } from '../hooks/useOrderParams';
import { usePaginationParams } from '../hooks/usePaginationParams';
import { Pagination } from './Pagination';

type CommunitiesTableProps = {
  communities: AdvancedSearchCommunity[];
};

export function CommunitiesTable({ communities }: CommunitiesTableProps) {
  const { pagination, setPage } = usePaginationParams();
  const { order, setOrder } = useOrderParams();

  function handleHeadClick(orderBy: AdvancedSearchOrder['by']) {
    setOrder({
      by: orderBy,
      direction: order.direction === 'ASC' ? 'DESC' : 'ASC',
    });
  }

  const totalPage = Math.ceil(communities[0].total_row_count / pagination.limit);

  return (
    <div className='flex flex-col items-center'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Collectivité</TableHead>
            <TableHead onClick={() => handleHeadClick('type')}>Type</TableHead>
            <TableHead className='text-right' onClick={() => handleHeadClick('population')}>
              Population
            </TableHead>
            <TableHead className='text-right'>Budget total</TableHead>
            <TableHead onClick={() => handleHeadClick('mp_score')}>Score Marchés Publics</TableHead>
            <TableHead onClick={() => handleHeadClick('subventions_score')}>
              Score Subventions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((community) => (
            <TableRow key={community.siren + community.type}>
              <TableCell className='font-medium'>{community.nom}</TableCell>
              <TableCell>{stringifyCommunityType(community.type)}</TableCell>
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
