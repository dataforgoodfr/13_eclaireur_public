import type { Meta, StoryObj } from '@storybook/react';
import { FicheIdentite } from './FicheIdentite';
import { Community } from '@/app/models/community';

// Mock data for a community
const mockCommunity: Community = {
  siren: '213105554',
  nom: 'Commune de Toulouse',
  code_postal: '31000',
  code_insee: '31555',
  departement: 'Haute-Garonne',
  region: 'Occitanie',
  population: 493465,
  nombre_marches: 1234,
  montant_marches: 567890123,
  nombre_subventions: 567,
  montant_subventions: 89012345,
  score_transparence: 0.85,
  date_derniere_publication: '2024-07-23',
};

const meta: Meta<typeof FicheIdentite> = {
  title: 'Community/FicheIdentite',
  component: FicheIdentite,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    community: mockCommunity,
  },
};

export default meta;

type Story = StoryObj<typeof FicheIdentite>;

export const Default: Story = {};
