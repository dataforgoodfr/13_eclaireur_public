'use client';

import type { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown, Settings2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '#components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '#components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#components/ui/popover';
import { cn } from '#utils/utils';

interface ViewOptionsButtonProps<TData> {
  table: Table<TData> | null;
}

export function ViewOptionsButton<TData>({ table }: ViewOptionsButtonProps<TData>) {
  const columns = React.useMemo(
    () =>
      table
        ?.getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== 'undefined' && column.getCanHide(),
        ) ?? [],
    [table],
  );

  if (!table) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="h-8 min-w-[120px]"
        disabled
      >
        <Settings2 className="mr-2 h-3 w-3" />
        Affichage
        <ChevronsUpDown className="ml-auto h-3 w-3 opacity-50" />
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-label="Toggle columns"
          role="combobox"
          variant="outline"
          size="sm"
          className="h-8 min-w-[120px]"
        >
          <Settings2 className="mr-2 h-3 w-3" />
          Affichage
          <ChevronsUpDown className="ml-auto h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="Rechercher les colonnes..." />
          <CommandList>
            <CommandEmpty>Aucune colonne trouvée.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <Check
                    className={cn(
                      'ml-auto size-4 shrink-0',
                      column.getIsVisible() ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}