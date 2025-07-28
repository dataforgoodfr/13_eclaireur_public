'use client';

import type { Table } from '@tanstack/react-table';
import { createContext, useContext } from 'react';

import type { AdvancedSearchCommunity } from '@/app/models/community';

interface TableContextType {
  table: Table<AdvancedSearchCommunity> | null;
  setTable: (table: Table<AdvancedSearchCommunity> | null) => void;
}

const TableContext = createContext<TableContextType | null>(null);

export function useTableContext() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context;
}

export function TableProvider({ 
  children, 
  table, 
  setTable 
}: { 
  children: React.ReactNode;
  table: Table<AdvancedSearchCommunity> | null;
  setTable: (table: Table<AdvancedSearchCommunity> | null) => void;
}) {
  return (
    <TableContext.Provider value={{ table, setTable }}>
      {children}
    </TableContext.Provider>
  );
}