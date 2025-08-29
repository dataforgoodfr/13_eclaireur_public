'use client';

import { PropsWithChildren } from 'react';

import { AdvancedSearchCommunity } from '#app/models/community';
import { Pagination } from '#components/Pagination';
import { Button } from '#components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#components/ui/table';
import { CommunityType } from '#utils/types.js';
import { cn, formatCompact, stringifyCommunityType } from '#utils/utils';
import { ArrowUpDown } from 'lucide-react';

import { AdvancedSearchOrder, useOrderParams } from '../hooks/useOrderParams';
import { usePaginationParams } from '../hooks/usePaginationParams';

type AdvancedSearchTableProps = {
  communities: AdvancedSearchCommunity[];
};

export function AdvancedSearchTable({ communities }: AdvancedSearchTableProps) {
  const { pagination, setPage } = usePaginationParams();
  const { order, setOrder } = useOrderParams();
  console.log('ok');
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
            <TableHead>
              <OrderingButton onClick={() => handleHeadClick('nom')}>Collectivité</OrderingButton>
            </TableHead>
            <TableHead>
              <OrderingButton className='justify-end' onClick={() => handleHeadClick('type')}>
                Type
              </OrderingButton>
            </TableHead>
            <TableHead>
              <OrderingButton className='justify-end' onClick={() => handleHeadClick('population')}>
                Population
              </OrderingButton>
            </TableHead>
            <TableHead>
              <OrderingButton
                className='justify-end'
                onClick={() => handleHeadClick('subventions_budget')}
              >
                Budget subventions (€)
              </OrderingButton>
            </TableHead>
            <TableHead>
              <OrderingButton className='justify-end' onClick={() => handleHeadClick('mp_score')}>
                Score Marchés Publics
              </OrderingButton>
            </TableHead>
            <TableHead>
              <OrderingButton
                className='justify-end'
                onClick={() => handleHeadClick('subventions_score')}
              >
                Score Subventions
              </OrderingButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((community) => (
            <TableRow key={community.siren + community.type}>
              <TableCell className='font-medium'>{community.nom}</TableCell>
              <TableCell className='text-right'>
                {stringifyCommunityType(community.type as CommunityType)}
              </TableCell>
              <TableCell className='text-right'>{formatCompact(community.population)}</TableCell>
              <TableCell className='text-right'>
                {formatCompact(community.subventions_budget)}
              </TableCell>
              <TableCell className='text-right'>{community.mp_score ?? '-'}</TableCell>
              <TableCell className='text-right'>{community.subventions_score ?? '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination totalPage={totalPage} activePage={pagination.page} onPageChange={setPage} />
    </div>
  );
}

type OrderingButtonProps = PropsWithChildren<{
  onClick: () => void;
}> &
  React.HTMLAttributes<HTMLDivElement>;

function OrderingButton({ children, onClick, className, ...restProps }: OrderingButtonProps) {
  return (
    <div className={cn('flex items-center', className)} {...restProps}>
      <Button variant='ghost' onClick={onClick}>
        {children}
        <ArrowUpDown />
      </Button>
    </div>
  );
}
