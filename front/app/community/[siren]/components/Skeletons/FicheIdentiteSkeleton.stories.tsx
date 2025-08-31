import type { Meta, StoryObj } from '@storybook/react';

import { FicheIdentiteSkeleton } from './FicheIdentiteSkeleton';

const meta: Meta<typeof FicheIdentiteSkeleton> = {
  // title: 'Community/Skeletons/FicheIdentiteSkeleton',
  component: FicheIdentiteSkeleton,
  parameters: {},
};

export default meta;

type Story = StoryObj<typeof FicheIdentiteSkeleton>;

export const Default: Story = {};
