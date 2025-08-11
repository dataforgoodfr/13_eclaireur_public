import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Evolution from './Evolution';

const yearlyAmountsData = [
  { "year": 2017, "amount": 0 },
  { "year": 2018, "amount": 1820000 },
  { "year": 2019, "amount": 1450000 },
  { "year": 2020, "amount": 2230000 },
  { "year": 2021, "amount": 4780000 },
  { "year": 2022, "amount": 1010000 },
  { "year": 2023, "amount": 1860000 },
  { "year": 2024, "amount": 660000 }
];

const yearlyCountsData = [
  { "year": 2017, "count": 0 },
  { "year": 2018, "count": 182 },
  { "year": 2019, "count": 145 },
  { "year": 2020, "count": 223 },
  { "year": 2021, "count": 478 },
  { "year": 2022, "count": 101 },
  { "year": 2023, "count": 186 },
  { "year": 2024, "count": 66 }
];

const meta: Meta<typeof Evolution> = {
  title: 'Community/[siren]/Components/FicheMarchesPublics/Evolution',
  component: Evolution,
  parameters: {
    layout: 'padded',
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/yearly_counts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyCountsData);
          }
          if (siren === '000000000') {
            return HttpResponse.json([]);
          }
          return HttpResponse.json(yearlyCountsData);
        }),
        http.get('/api/communities/:siren/marches_publics/yearly_amounts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyAmountsData);
          }
          if (siren === '000000000') {
            return HttpResponse.json([]);
          }
          return HttpResponse.json(yearlyAmountsData);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Composant Evolution complet avec header, switch et graphique des marchés publics. Utilise le nouveau EvolutionChart en interne.',
      },
    },
  },
  argTypes: {
    siren: {
      description: 'SIREN de la collectivité',
      control: { type: 'text' },
    },
    transparencyIndex: {
      description: 'Indice de transparence (A, B, C, D, E)',
      control: { type: 'select' },
      options: [null, 'A', 'B', 'C', 'D', 'E'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Evolution>;

export const Default: Story = {
  args: {
    siren: '213105554',
    transparencyIndex: 'B',
  },
  parameters: {
    docs: {
      description: {
        story: 'État par défaut avec données et indice de transparence.',
      },
    },
  },
};

export const WithoutTransparencyIndex: Story = {
  args: {
    siren: '213105554',
    transparencyIndex: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Sans indice de transparence affiché.',
      },
    },
  },
};

export const NoData: Story = {
  args: {
    siren: '000000000',
    transparencyIndex: 'C',
  },
  parameters: {
    docs: {
      description: {
        story: 'État sans données - affiche l\'image no-data-bar avec bouton Interpeller.',
      },
    },
  },
};