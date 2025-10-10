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

export const Default: Story = {
  args: {},
};
