import { useState } from 'react';

import { AdvancedSearchCommunity } from '@/app/models/community';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { CommunityType } from '@/utils/types';
import type { Meta, StoryObj } from '@storybook/react';
import type { Table } from '@tanstack/react-table';

import { AdvancedSearchDataTable } from './AdvancedSearchDataTable';
import DownloadingButton from './DownloadingButton';
import { Filters } from './Filters/Filters';
import { TableProvider } from './TableContext';
import { ViewOptionsButton } from './ViewOptionsButton';

// Mock data for communities
const mockCommunitiesData: AdvancedSearchCommunity[] = [
  {
    siren: '213105554',
    nom: 'Toulouse',
    type: CommunityType.Commune,
    population: 493465,
    subventions_budget: 12500000,
    mp_score: TransparencyScore.A,
    subventions_score: TransparencyScore.B,
    total_row_count: 125,
  },
  {
    siren: '213304021',
    nom: 'Bordeaux',
    type: CommunityType.Commune,
    population: 260958,
    subventions_budget: 8900000,
    mp_score: TransparencyScore.B,
    subventions_score: TransparencyScore.A,
    total_row_count: 125,
  },
  {
    siren: '213400372',
    nom: 'Montpellier',
    type: CommunityType.Commune,
    population: 295542,
    subventions_budget: 9800000,
    mp_score: TransparencyScore.A,
    subventions_score: TransparencyScore.C,
    total_row_count: 125,
  },
  {
    siren: '243100518',
    nom: 'Toulouse Métropole',
    type: CommunityType.CA,
    population: 783353,
    subventions_budget: 45000000,
    mp_score: TransparencyScore.B,
    subventions_score: TransparencyScore.B,
    total_row_count: 125,
  },
  {
    siren: '213440043',
    nom: 'Carcassonne',
    type: CommunityType.Commune,
    population: 47419,
    subventions_budget: 2100000,
    mp_score: null,
    subventions_score: TransparencyScore.D,
    total_row_count: 125,
  },
];

const meta: Meta<typeof AdvancedSearchDataTable> = {
  title: 'Advanced Search/DataTable',
  component: AdvancedSearchDataTable,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      const [table, setTable] = useState<Table<AdvancedSearchCommunity> | null>(null);
      return (
        <TableProvider table={table} setTable={setTable}>
          <Story />
        </TableProvider>
      );
    },
  ],
  args: {
    communities: mockCommunitiesData,
    pageCount: 13,
    isLoading: false,
  },
};

export default meta;

type Story = StoryObj<typeof AdvancedSearchDataTable>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
    communities: [], // Pas de données pendant le chargement
    pageCount: 0,
  },
};

export const EmptyResults: Story = {
  args: {
    communities: [],
    pageCount: 0,
    isLoading: false,
  },
};

export const SinglePage: Story = {
  args: {
    communities: mockCommunitiesData.slice(0, 3),
    pageCount: 1,
    isLoading: false,
  },
};

export const WithFilters: Story = {
  args: {
    communities: mockCommunitiesData,
    pageCount: 13,
    isLoading: false,
  },
  render: function WithFiltersStory(args) {
    const [table, setTable] = useState<Table<AdvancedSearchCommunity> | null>(null);
    return (
      <TableProvider table={table} setTable={setTable}>
        <div className='space-y-4'>
          <div className='flex items-end justify-between'>
            <Filters />
            <div className='flex items-end gap-2'>
              <ViewOptionsButton table={table} />
              <DownloadingButton />
            </div>
          </div>
          <AdvancedSearchDataTable {...args} />
        </div>
      </TableProvider>
    );
  },
};
