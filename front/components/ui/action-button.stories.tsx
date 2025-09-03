import { ActionButton } from '#components/ui/action-button';
import type { Meta, StoryObj } from '@storybook/react';
import { Download, Plus, Share } from 'lucide-react';

const meta: Meta<typeof ActionButton> = {
  title: 'UI/ActionButton',
  component: ActionButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['default', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

// Icon only - creates a square h-12 w-12 button
export const IconOnly: Story = {
  args: {
    icon: <Share className='h-6 w-6' />,
    variant: 'outline',
  },
};

// Text only - creates a standard button with padding
export const TextOnly: Story = {
  args: {
    text: 'Comparer',
    variant: 'default',
  },
};

// Icon + Text - creates a button with both
export const IconWithText: Story = {
  args: {
    icon: <Download className='h-4 w-4' />,
    text: 'Télécharger',
    variant: 'default',
  },
};

// Custom children - full control over content
export const CustomContent: Story = {
  args: {
    variant: 'outline',
    children: (
      <div className='flex items-center gap-2'>
        <Plus className='h-4 w-4' />
        <span>Ajouter</span>
        <span className='rounded bg-primary px-1 text-xs text-white'>2</span>
      </div>
    ),
  },
};

// Rounded utilities showcase
export const RoundedUtilities: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Default (rounded-tl-br)</p>
        <ActionButton text='Default' variant='default' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Small (rounded-tl-br-sm)</p>
        <ActionButton text='Small' variant='outline' className='rounded-tl-br-sm' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Large (rounded-tl-br-lg)</p>
        <ActionButton text='Large' variant='default' className='rounded-tl-br-lg' />
      </div>
      <div className='space-y-2'>
        <p className='text-sm font-medium'>Extra Large (rounded-tl-br-xl)</p>
        <ActionButton text='Extra Large' variant='outline' className='rounded-tl-br-xl' />
      </div>
    </div>
  ),
};

// All variants together
export const AllVariants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-4'>
      <ActionButton icon={<Share className='h-6 w-6' />} variant='outline' />
      <ActionButton text='Comparer' variant='default' />
      <ActionButton icon={<Download className='h-4 w-4' />} text='Télécharger' variant='outline' />
      <ActionButton variant='default'>
        <div className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          <span>Custom</span>
        </div>
      </ActionButton>
    </div>
  ),
};
