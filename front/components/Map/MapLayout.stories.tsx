import type { Meta, StoryObj } from '@storybook/react';

import MapLayout from './MapLayout';

const meta: Meta<typeof MapLayout> = {
  title: 'Map/MapLayout',
  component: MapLayout,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockMinMaxValues = [
  { type: 'commune', min_population: 100, max_population: 100000 },
  { type: 'departement', min_population: 50000, max_population: 2000000 },
  { type: 'region', min_population: 500000, max_population: 12000000 },
];

export const Default: Story = {
  args: {
    minMaxValues: mockMinMaxValues,
  },
};
