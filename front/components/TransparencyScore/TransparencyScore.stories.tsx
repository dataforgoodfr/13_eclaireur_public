import type { Meta, StoryObj } from '@storybook/react';

import { TransparencyScore } from '#components/TransparencyScore/constants';
import { TransparencyScoreBar } from './TransparencyScore';

const meta = {
  title: 'Components/TransparencyScore',
  component: TransparencyScoreBar,
} satisfies Meta<typeof TransparencyScoreBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ScoreA: Story = {
  args: {
    score: TransparencyScore.A,
  },
};

export const ScoreB: Story = {
  args: {
    score: TransparencyScore.B,
  },
};

export const ScoreC: Story = {
  args: {
    score: TransparencyScore.C,
  },
};

export const ScoreD: Story = {
  args: {
    score: TransparencyScore.D,
  },
};

export const ScoreE: Story = {
  args: {
    score: TransparencyScore.E,
  },
};

export const NoScore: Story = {
  args: {
    score: null,
  },
};
