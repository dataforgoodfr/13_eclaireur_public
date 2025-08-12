import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Comparison from './Comparison';

const comparisonData = [
  {
    year: '2019',
    community: 43,
    communityLabel: '43',
    regional: 39,
    regionalLabel: '39',
  },
  {
    year: '2020',
    community: 55,
    communityLabel: '55',
    regional: 30,
    regionalLabel: '30',
  },
  {
    year: '2021',
    community: 55,
    communityLabel: '55',
    regional: 43,
    regionalLabel: '43',
  },
  {
    year: '2022',
    community: 43,
    communityLabel: '43',
    regional: 39,
    regionalLabel: '39',
  },
  {
    year: '2023',
    community: 55,
    communityLabel: '55',
    regional: 30,
    regionalLabel: '30',
  },
  {
    year: '2024',
    community: 55,
    communityLabel: '55',
    regional: 30,
    regionalLabel: '30',
  },
];

const meta: Meta<typeof Comparison> = {
  component: Comparison,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/comparison', ({ params }) => {
          const { siren } = params;

          if (siren === '213105554') {
            return HttpResponse.json(comparisonData);
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Component displaying comparison of public markets budget with regional average.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Comparison>;

export const Default: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state showing comparison charts with amount view and statistics cards.',
      },
    },
  },
};