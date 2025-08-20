import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Comparison from './Comparison';

const comparisonData = [
  {
    year: '2018',
    community: 45000000,
    communityLabel: 'Budget de collectivité',
    regional: 52000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2019',
    community: 43000000,
    communityLabel: 'Budget de collectivité',
    regional: 50000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2020',
    community: 55000000,
    communityLabel: 'Budget de collectivité',
    regional: 48000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2021',
    community: 58000000,
    communityLabel: 'Budget de collectivité',
    regional: 51000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2022',
    community: 62000000,
    communityLabel: 'Budget de collectivité',
    regional: 54000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2023',
    community: 67000000,
    communityLabel: 'Budget de collectivité',
    regional: 57000000,
    regionalLabel: 'Moyenne régionale',
  },
  {
    year: '2024',
    community: 70000000,
    communityLabel: 'Budget de collectivité',
    regional: 60000000,
    regionalLabel: 'Moyenne régionale',
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
        story: 'Default state showing comparison charts with realistic budget data. Shows both desktop and mobile responsive views.',
      },
    },
  },
};

export const DesktopView: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Desktop view showing the full comparison chart with proper formatting and normalized bar sizing.',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view showing the horizontal bar comparison with proper spacing and ISO formatting.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Force mobile viewport for this story
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      // Trigger a resize event to update the mobile detection
      window.dispatchEvent(new Event('resize'));
      return (
        <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
          <Story />
        </div>
      );
    },
  ],
};

export const MobileDepartementalComparison: Story = {
  args: {
    siren: '213105554',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/comparison', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            // Different data for departmental comparison
            return HttpResponse.json([
              {
                year: '2018',
                community: 45000000,
                communityLabel: 'Budget de collectivité',
                regional: 48000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2019',
                community: 43000000,
                communityLabel: 'Budget de collectivité',
                regional: 46000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2020',
                community: 55000000,
                communityLabel: 'Budget de collectivité',
                regional: 44000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2021',
                community: 58000000,
                communityLabel: 'Budget de collectivité',
                regional: 47000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2022',
                community: 62000000,
                communityLabel: 'Budget de collectivité',
                regional: 50000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2023',
                community: 67000000,
                communityLabel: 'Budget de collectivité',
                regional: 53000000,
                regionalLabel: 'Moyenne départementale',
              },
              {
                year: '2024',
                community: 70000000,
                communityLabel: 'Budget de collectivité',
                regional: 56000000,
                regionalLabel: 'Moyenne départementale',
              },
            ]);
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    docs: {
      description: {
        story: 'Mobile view showing comparison with departmental average. Shows how the mobile component adapts to different comparison types.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Force mobile viewport for this story
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      // Trigger a resize event to update the mobile detection
      window.dispatchEvent(new Event('resize'));
      return (
        <div className="bg-white p-4 rounded-lg max-w-md mx-auto">
          <Story />
        </div>
      );
    },
  ],
};