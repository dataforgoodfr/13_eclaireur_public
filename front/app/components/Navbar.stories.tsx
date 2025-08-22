import { mobileParams } from '#.storybook/utils.tsx';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';

import Navbar from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
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
  args: {
    isBeta: false,
  },
};

export const WithBackground: Story = {
  args: {
    isBeta: false,
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Story />
        <div style={{ padding: '80px 20px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Page Content Example
          </h1>
          <p style={{ color: '#64748b', lineHeight: '1.6' }}>
            This shows how the navbar looks with page content below it. The navbar is fixed at the
            top and creates proper spacing for the content underneath.
          </p>
        </div>
      </div>
    ),
  ],
};

export const WithBetaBanner: Story = {
  args: {
    isBeta: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This story shows the navbar with the beta banner enabled.',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    isBeta: false,
  },
  ...mobileParams,
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%' }}>
        <Story />
        <div style={{ padding: '80px 20px 20px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Mobile View
          </h1>
          <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.875rem' }}>
            On mobile, the navigation menu is collapsed into a hamburger menu, and the search bar is
            moved to the mobile menu.
          </p>
        </div>
      </div>
    ),
  ],
};

export const MobileMenuOpen: Story = {
  args: {
    isBeta: false,
  },
  parameters: {
    ...mobileParams.parameters,
    docs: {
      description: {
        story:
          'This story automatically opens the mobile navigation menu to show the expanded state with search bar, Interpeller button, and accordion menu items.',
      },
    },
  },
  globals: {
    viewport: { value: 'iphone5', isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const menuButton = canvas.getByRole('button');
    await userEvent.click(menuButton);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const searchInputs = canvas.getAllByPlaceholderText('Rechercher...');
    await expect(searchInputs.length).toBeGreaterThan(1);
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', width: '100%' }}>
        <Story />
        <div style={{ padding: '80px 20px 20px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Mobile Menu Open
          </h1>
          <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: '0.875rem' }}>
            This story automatically opens the mobile navigation menu to demonstrate the expanded
            state. The menu includes a search bar, Interpeller button, and collapsible navigation
            sections.
          </p>
        </div>
      </div>
    ),
  ],
};
