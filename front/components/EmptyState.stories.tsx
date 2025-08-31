import type { Meta, StoryObj } from '@storybook/react';

import EmptyState from './EmptyState';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: "Titre principal du message d'erreur",
    },
    description: {
      control: 'text',
      description: 'Description du problème et des actions possibles',
    },
    actionText: {
      control: 'text',
      description: "Texte du bouton d'action",
    },
    actionHref: {
      control: 'text',
      description: "URL de redirection du bouton d'action",
    },
    className: {
      control: 'text',
      description: 'Classes CSS additionnelles',
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// Histoire par défaut
export const Default: Story = {
  args: {},
};

// Histoire pour les subventions
export const Subventions: Story = {
  args: {
    title: "Oups, il n'y a pas de données sur les subventions de cette collectivité !",
    description:
      'Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les subventions publiques.',
    actionText: 'Interpeller',
    actionHref: '/interpeller',
  },
};

// Histoire pour les marchés publics
export const MarchesPublics: Story = {
  args: {
    title: "Oups, il n'y a pas de données sur les marchés publics de cette collectivité !",
    description:
      'Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les marchés publics.',
    actionText: 'Interpeller',
    actionHref: '/interpeller',
  },
};

// Histoire avec texte personnalisé
export const Custom: Story = {
  args: {
    title: 'Aucune donnée disponible',
    description:
      'Les informations que vous recherchez ne sont pas encore disponibles. Vous pouvez contribuer à améliorer la transparence en contactant les responsables.',
    actionText: 'Contribuer',
    actionHref: '/contribute',
  },
};

// Histoire dans un conteneur plus large
export const InContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className='w-[800px] bg-gray-50 p-8'>
        <Story />
      </div>
    ),
  ],
};

// Histoire mobile
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => (
      <div className='w-[375px] p-4'>
        <Story />
      </div>
    ),
  ],
};
