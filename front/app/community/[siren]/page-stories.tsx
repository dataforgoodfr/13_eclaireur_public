import { type Meta, type StoryObj } from '@storybook/react';
import { http } from 'msw';
import Page from './page';
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

// Mock fetchCommunities function
// This will be used to control the data returned by the page's data fetching logic
const mockFetchCommunities = async (options?: any, pagination?: any): Promise<Community[]> => {
  const siren = options?.filters?.siren;
  if (siren === '213105554') {
    return [mockCommunity];
  } else if (siren === 'notfound') {
    return [];
  } else if (siren === 'error') {
    throw new Error('Failed to fetch community data');
  } else if (siren === 'loading') {
    // Simulate a long loading time
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [mockCommunity];
  }
  return [];
};

// Mock the module where fetchCommunities is imported
jest.mock('@/utils/fetchers/communities/fetchCommunities-server', () => ({
  fetchCommunities: jest.fn(mockFetchCommunities),
}));

const meta = {
  component: Page,
  title: 'Community Page',
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    params: { siren: '213105554' }, // Default siren for stories
  },
} satisfies Meta<typeof Page>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    params: { siren: '213105554' },
  },
};

export const NotFound: Story = {
  args: {
    params: { siren: 'notfound' },
  },
};

export const ErrorState: Story = {
  args: {
    params: { siren: 'error' },
  },
};

export const LoadingState: Story = {
  args: {
    params: { siren: 'loading' },
  },
};
