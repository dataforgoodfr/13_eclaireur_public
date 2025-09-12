import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import HomePageHeader from './HomePageHeader';

const meta: Meta<typeof HomePageHeader> = {
  title: 'Pages/HomePageHeader',
  component: HomePageHeader,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        push: fn(),
        replace: fn(),
        back: fn(),
        forward: fn(),
        refresh: fn(),
        prefetch: fn(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomBackground: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Story />
      </div>
    ),
  ],
};
