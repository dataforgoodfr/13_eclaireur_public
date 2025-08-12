'use client';

import type { Table } from '@tanstack/react-table';
import { Users, GitCompareArrows } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Badge } from '#components/ui/badge';
import { Button } from '#components/ui/button';

import type { AdvancedSearchCommunity } from '@/app/models/community';

interface SelectionStatusProps {
  table: Table<AdvancedSearchCommunity> | null;
}

export function SelectionStatus({ table }: SelectionStatusProps) {
  const router = useRouter();
  
  if (!table) return null;

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = selectedRows.length;
  
  if (selectedCount === 0) return null;

  const handleClearSelection = () => {
    table.resetRowSelection();
  };

  const handleCompare = () => {
    if (selectedCount === 2) {
      const [firstRow, secondRow] = selectedRows;
      const firstSiren = firstRow.original.siren;
      const secondSiren = secondRow.original.siren;
      router.push(`/community/${firstSiren}/comparison/${secondSiren}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1">
        <Users className="h-3 w-3" />
        {selectedCount} sélectionné{selectedCount > 1 ? 's' : ''}
      </Badge>
      
      {selectedCount === 1 && (
        <span className="text-sm text-muted-foreground">
          Sélectionnez une autre collectivité pour comparer
        </span>
      )}
      
      {selectedCount === 2 && (
        <Button
          variant="default"
          size="sm"
          onClick={handleCompare}
          className="h-6 px-3 text-xs gap-1"
        >
          <GitCompareArrows className="h-3 w-3" />
          Comparer
        </Button>
      )}
      
      {selectedCount > 2 && (
        <span className="text-sm text-orange-600">
          Veuillez sélectionner seulement 2 collectivités pour comparer
        </span>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleClearSelection}
        className="h-6 px-2 text-xs"
      >
        Effacer
      </Button>
    </div>
  );
}