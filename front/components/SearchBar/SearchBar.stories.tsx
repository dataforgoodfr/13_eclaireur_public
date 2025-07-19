import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
    title: 'Components/SearchBar',
    component: SearchBar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        onSelect: { action: 'selected' },
    },
    args: {
        onSelect: fn(),
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const WithContainer: Story = {
    args: {},
    decorators: [
        (Story) => (
            <div className="w-96 p-4">
                <Story />
            </div>
        ),
    ],
};

export const FullWidth: Story = {
    args: {},
    decorators: [
        (Story) => (
            <div className="w-full max-w-2xl p-4">
                <Story />
            </div>
        ),
    ],
};
