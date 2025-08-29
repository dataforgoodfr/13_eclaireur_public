import type { Meta, StoryObj } from '@storybook/react';

import MobileComparisonChart from './MobileComparisonChart';

const regionalComparisonData = [
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

const departementalComparisonData = [
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
];

const meta: Meta<typeof MobileComparisonChart> = {
  // community-siren-components-fichemarchespublics-mobilecomparisonchart-v2--regional-comparison
  title: 'community/[siren]/components/FicheMarchesPublics/ComparisonMobileV2',
  component: MobileComparisonChart,
  parameters: {
    docs: {
      description: {
        component:
          'Mobile component displaying comparison of public markets budget with regional/departmental/national averages.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className='space-y-2'>
        <div className='flex flex-col items-center gap-4'>
          <div className='text-center'>
            <h3 className='mb-2 text-xl font-medium'>Comparaison avec la moyenne régionale</h3>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex h-12 w-12 items-center justify-center rounded bg-primary'>
              <svg
                className='h-4 w-4 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <div className='flex h-12 items-center gap-2 rounded-br-lg rounded-tl-lg border border-gray-300 bg-white px-4'>
              <span>Régional</span>
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>
        <div className='relative'>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MobileComparisonChart>;

export const RegionalComparison: Story = {
  args: {
    data: regionalComparisonData,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile view showing comparison with regional average. Bars are normalized across all years for proper visual comparison.',
      },
    },
  },
};

export const DepartementalComparison: Story = {
  args: {
    data: departementalComparisonData,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile view showing comparison with departmental average. The community budget is consistently higher than the departmental average.',
      },
    },
  },
};

export const LowDataExample: Story = {
  args: {
    data: [
      {
        year: '2022',
        community: 12000000,
        communityLabel: 'Budget de collectivité',
        regional: 15000000,
        regionalLabel: 'Moyenne régionale',
      },
      {
        year: '2023',
        community: 13500000,
        communityLabel: 'Budget de collectivité',
        regional: 15500000,
        regionalLabel: 'Moyenne régionale',
      },
      {
        year: '2024',
        community: 14200000,
        communityLabel: 'Budget de collectivité',
        regional: 16000000,
        regionalLabel: 'Moyenne régionale',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mobile view with fewer data points and smaller budget values, showing how the component adapts to different data scales.',
      },
    },
  },
};
