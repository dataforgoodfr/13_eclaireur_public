import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { EvolutionChart } from './EvolutionChart';

// Mock data pour les marchés publics
const marchesPublicsAmountsData = [
  { "year": 2017, "amount": 0 },
  { "year": 2018, "amount": 1820000 },
  { "year": 2019, "amount": 1450000 },
  { "year": 2020, "amount": 2230000 },
  { "year": 2021, "amount": 4780000 },
  { "year": 2022, "amount": 1010000 },
  { "year": 2023, "amount": 1860000 },
  { "year": 2024, "amount": 660000 }
];

const marchesPublicsCountsData = [
  { "year": 2017, "count": 0 },
  { "year": 2018, "count": 182 },
  { "year": 2019, "count": 145 },
  { "year": 2020, "count": 223 },
  { "year": 2021, "count": 478 },
  { "year": 2022, "count": 101 },
  { "year": 2023, "count": 186 },
  { "year": 2024, "count": 66 }
];

// Mock data pour les subventions
const subventionsAmountsData = [
  { "year": 2017, "amount": 0 },
  { "year": 2018, "amount": 850000 },
  { "year": 2019, "amount": 920000 },
  { "year": 2020, "amount": 1200000 },
  { "year": 2021, "amount": 1800000 },
  { "year": 2022, "amount": 750000 },
  { "year": 2023, "amount": 980000 },
  { "year": 2024, "amount": 450000 }
];

const subventionsCountsData = [
  { "year": 2017, "count": 0 },
  { "year": 2018, "count": 85 },
  { "year": 2019, "count": 92 },
  { "year": 2020, "count": 120 },
  { "year": 2021, "count": 180 },
  { "year": 2022, "count": 75 },
  { "year": 2023, "count": 98 },
  { "year": 2024, "count": 45 }
];

const meta: Meta<typeof EvolutionChart> = {
  title: 'Community/[siren]/Components/EvolutionChart',
  component: EvolutionChart,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        // Marchés publics handlers
        http.get('/api/communities/:siren/marches_publics/yearly_counts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(marchesPublicsCountsData);
          }
          if (siren === '000000000') { // SIREN pour no data
            return HttpResponse.json([]);
          }
          return HttpResponse.json(marchesPublicsCountsData);
        }),
        http.get('/api/communities/:siren/marches_publics/yearly_amounts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(marchesPublicsAmountsData);
          }
          if (siren === '000000000') { // SIREN pour no data
            return HttpResponse.json([]);
          }
          return HttpResponse.json(marchesPublicsAmountsData);
        }),
        // Subventions handlers
        http.get('/api/communities/:siren/subventions/yearly_counts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(subventionsCountsData);
          }
          if (siren === '000000000') { // SIREN pour no data
            return HttpResponse.json([]);
          }
          return HttpResponse.json(subventionsCountsData);
        }),
        http.get('/api/communities/:siren/subventions/yearly_amounts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(subventionsAmountsData);
          }
          if (siren === '000000000') { // SIREN pour no data
            return HttpResponse.json([]);
          }
          return HttpResponse.json(subventionsAmountsData);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Composant unifié pour afficher l\'évolution des marchés publics ou subventions au cours du temps. Support mobile/desktop et état "no data".',
      },
    },
  },
  argTypes: {
    siren: {
      description: 'SIREN de la collectivité',
      control: { type: 'text' },
    },
    displayMode: {
      description: 'Mode d\'affichage des données',
      control: { type: 'select' },
      options: ['amounts', 'counts'],
    },
    chartType: {
      description: 'Type de données à afficher',
      control: { type: 'select' },
      options: ['marches-publics', 'subventions'],
    },
    data: {
      description: 'Données à afficher (géré automatiquement)',
      table: { disable: true },
    },
    isPending: {
      description: 'État de chargement',
      control: { type: 'boolean' },
    },
    isError: {
      description: 'État d\'erreur',
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EvolutionChart>;

export const MarchesPublicsAmounts: Story = {
  args: {
    siren: '213105554',
    displayMode: 'amounts',
    chartType: 'marches-publics',
    data: marchesPublicsAmountsData,
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Graphique des montants des marchés publics avec données.',
      },
    },
  },
};

export const MarchesPublicsCounts: Story = {
  args: {
    siren: '213105554',
    displayMode: 'counts',
    chartType: 'marches-publics',
    data: marchesPublicsCountsData,
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Graphique du nombre de marchés publics avec données.',
      },
    },
  },
};

export const SubventionsAmounts: Story = {
  args: {
    siren: '213105554',
    displayMode: 'amounts',
    chartType: 'subventions',
    data: subventionsAmountsData,
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Graphique des montants des subventions avec données.',
      },
    },
  },
};

export const SubventionsCounts: Story = {
  args: {
    siren: '213105554',
    displayMode: 'counts',
    chartType: 'subventions',
    data: subventionsCountsData,
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Graphique du nombre de subventions avec données.',
      },
    },
  },
};

export const NoDataState: Story = {
  args: {
    siren: '000000000',
    displayMode: 'amounts',
    chartType: 'marches-publics',
    data: [],
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'État "aucune donnée" avec image et bouton Interpeller.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    siren: '213105554',
    displayMode: 'amounts',
    chartType: 'marches-publics',
    data: null,
    isPending: true,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'État de chargement.',
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    siren: '213105554',
    displayMode: 'amounts',
    chartType: 'marches-publics',
    data: null,
    isPending: false,
    isError: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'État d\'erreur de récupération des données.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    siren: '213105554',
    displayMode: 'amounts',
    chartType: 'marches-publics',
    data: marchesPublicsAmountsData,
    isPending: false,
    isError: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Version interactive avec tous les contrôles disponibles.',
      },
    },
  },
};