import { usePagination } from '#utils/hooks/usePagination';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import MarchesPublicsTable from './MarchesPublicsTable';

// Helper component to provide pagination props
function MarchesPublicsTableWithPagination(props: React.ComponentProps<typeof MarchesPublicsTable>) {
  const paginationProps = usePagination();
  return <MarchesPublicsTable {...props} paginationProps={paginationProps} />;
}

const mockData = [
  {
    id: 1,
    acheteur_id: '213105554',
    objet: 'Construction d\'une école primaire',
    titulaire_denomination_sociale: 'Entreprise BTP Sud',
    montant: 1500000,
    codecpv: '45210000-2',
    cpv_8: '45210000',
    cpv_8_label: 'Travaux de construction de bâtiments',
    cpv_2: '45',
    cpv_2_label: 'Travaux de construction',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
  },
  {
    id: 2,
    acheteur_id: '213105554',
    objet: 'Fourniture de matériel informatique',
    titulaire_denomination_sociale: 'Tech Solutions',
    montant: 50000,
    codecpv: '30200000-0',
    cpv_8: '30200000',
    cpv_8_label: 'Matériel informatique',
    cpv_2: '30',
    cpv_2_label: 'Machines de bureau et de calcul',
    annee_notification: 2022,
    annee_publication_donnees: 2022,
    source: 'JOUE',
  },
];

const meta: Meta<typeof MarchesPublicsTableWithPagination> = {
  // title: 'Community/FicheMarchesPublics/MarchesPublicsTable',
  component: MarchesPublicsTableWithPagination,
  parameters: {
    docs: {
      description: {
        component: 'Table component displaying public markets data with pagination support.',
      },
    },
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/paginated', ({ params, request }) => {
          const { siren } = params;
          const url = new URL(request.url);
          const year = url.searchParams.get('year');
          
          if (siren === 'nodata') {
            return HttpResponse.json([]);
          }
          if (siren === 'single') {
            return HttpResponse.json([mockData[0]]);
          }
          if (siren === 'many') {
            const manyData = Array.from({ length: 50 }, (_, i) => ({
              ...mockData[0],
              id: i + 1,
              objet: `Marché public ${i + 1}`,
              montant: Math.floor(Math.random() * 1000000) + 50000,
            }));
            return HttpResponse.json(manyData);
          }
          
          let data = mockData;
          if (year && year !== 'All') {
            data = mockData.filter(item => item.annee_notification === parseInt(year));
          }
          
          return HttpResponse.json(data);
        }),
      ],
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