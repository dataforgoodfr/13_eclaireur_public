import type { Meta, StoryObj } from '@storybook/react';
import { FicheMarchesPublicsSkeleton } from './FicheMarchesPublicsSkeleton';

const meta: Meta<typeof FicheMarchesPublicsSkeleton> = {
  // title: 'Community/Skeletons/FicheMarchesPublicsSkeleton',
  component: FicheMarchesPublicsSkeleton,
  parameters: {
  },
};

export default meta;

type Story = StoryObj<typeof FicheMarchesPublicsSkeleton>;

export const Default: Story = {};
