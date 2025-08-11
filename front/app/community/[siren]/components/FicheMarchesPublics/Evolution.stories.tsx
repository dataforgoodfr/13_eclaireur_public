import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Evolution from './Evolution';

const yearlyAmountsData = [
  { "year": 2019, "amount": 1820000 },
  { "year": 2020, "amount": 1450000 },
  { "year": 2021, "amount": 2230000 },
  { "year": 2022, "amount": 4780000 },
  { "year": 2023, "amount": 1010000 },
  { "year": 2024, "amount": 1860000 },
  { "year": 2025, "amount": 660000 },
  { "year": null, "amount": 640000 }
];

const yearlyCountsData = [
  { "year": 2019, "count": 182 },
  { "year": 2020, "count": 145 },
  { "year": 2021, "count": 223 },
  { "year": 2022, "count": 478 },
  { "year": 2023, "count": 101 },
  { "year": 2024, "count": 186 },
  { "year": 2025, "count": 66 },
  { "year": null, "count": 64 }
];

const meta: Meta<typeof Evolution> = {
  component: Evolution,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/yearly_counts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyCountsData);
          }
          return HttpResponse.json([]);
        }),
        http.get('/api/communities/:siren/marches_publics/yearly_amounts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyAmountsData);
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Component displaying the evolution of public markets over time with toggle between amounts and counts.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Evolution>;

export const Default: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state showing the evolution chart with amounts view.',
      },
    },
  },
};