import type { Meta, StoryObj } from '@storybook/react';
import { FicheSubventionsSkeleton } from './FicheSubventionsSkeleton';

const meta: Meta<typeof FicheSubventionsSkeleton> = {
  title: 'Community/Skeletons/FicheSubventionsSkeleton',
  component: FicheSubventionsSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof FicheSubventionsSkeleton>;

export const Default: Story = {};
