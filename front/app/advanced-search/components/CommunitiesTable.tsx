import { Community } from '@/app/models/community';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber } from '@/utils/utils';
import { Table } from 'lucide-react';

type CommunitiesTableProps = {
  communities: Community[];
};

export function CommunitiesTable({ communities }: CommunitiesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[100px]'>Collectivite</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className='text-right'>Population</TableHead>
          <TableHead className='text-right'>Budget total</TableHead>
          <TableHead>Score Marches Publics</TableHead>
          <TableHead>Score Subventions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communities.map((community) => (
          <TableRow key={community.siren}>
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
  );
}
