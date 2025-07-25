import { usePagination } from '#utils/hooks/usePagination';
import type { Meta, StoryObj } from '@storybook/react';
import MarchesPublicsTable from './MarchesPublicsTable';

// Helper component to provide pagination props
function MarchesPublicsTableWithPagination(props: any) {
  const paginationProps = usePagination();
  return <MarchesPublicsTable {...props} paginationProps={paginationProps} />;
}

const meta: Meta<typeof MarchesPublicsTableWithPagination> = {
  title: 'Community/FicheMarchesPublics/MarchesPublicsTable',
  component: MarchesPublicsTableWithPagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Table component displaying public markets data with pagination support.',
      },
    },
  },
  argTypes: {
    siren: {
      control: 'select',
      options: ['213105554', 'nodata', 'single', 'many'],
      description: 'SIREN number that determines the data scenario',
    },
    year: {
      control: 'select',
      options: ['All', 2023, 2022, 2021, 2020],
      description: 'Year filter for the data',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarchesPublicsTableWithPagination>;

export const Default: Story = {
  args: {
    siren: '213105554',
    year: 'All',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state with typical public markets data. Shows multiple entries with pagination.',
      },
    },
  },
};

export const SingleMarket: Story = {
  args: {
    siren: 'single',
    year: 'All',
  },
  parameters: {
    docs: {
      description: {
        story: 'State with only one public market entry. Useful for testing edge cases in tables.',
      },
    },
  },
};

export const ManyMarkets: Story = {
  args: {
    siren: 'many',
    year: 'All',
  },
  parameters: {
    docs: {
      description: {
        story: 'State with many public markets (50 items). Tests performance and pagination scenarios.',
      },
    },
  },
};

export const NoData: Story = {
  args: {
    siren: 'nodata',
    year: 'All',
  },
  parameters: {
    docs: {
      description: {
        story: 'State when no public markets data is available. Shows the NoData component.',
      },
    },
  },
};

export const FilteredByYear: Story = {
  args: {
    siren: '213105554',
    year: 2023,
  },
  parameters: {
    docs: {
      description: {
        story: 'State with data filtered by a specific year (2023). Shows only markets from that year.',
      },
    },
  },
};