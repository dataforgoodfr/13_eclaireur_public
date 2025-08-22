// utils/fetchers/subventions/__mocks__/fetchSubventions-server.ts
import { Subvention } from '#app/models/subvention';

import { SubventionsParams } from '../createSQLQueryParams';

const mockSubventionsData: Subvention[] = [
  {
    id: 's1',
    id_attribuant: '213105554',
    montant: 10000,
    objet: 'Subvention pour association sportive',
    date_convention: '2023-05-01',
    // Add other required fields from your Subvention model
  },
  {
    id: 's2',
    id_attribuant: '213105554',
    montant: 25000,
    objet: 'Subvention pour projet culturel',
    date_convention: '2023-06-10',
  },
  {
    id: 's3',
    id_attribuant: '213105554',
    montant: 15000,
    objet: 'Subvention pour projet éducatif',
    date_convention: '2023-07-15',
  },
];

/**
 * Mock version of fetchSubventions for Storybook
 * Simulates different scenarios based on the siren/id_attribuant
 */
export async function fetchSubventions(options?: SubventionsParams): Promise<Subvention[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const siren = options?.filters?.id_attribuant;

  // Handle different test scenarios
  switch (siren) {
    case 'nodata':
      return [];

    case 'error':
      throw new Error('Failed to fetch subventions data');

    case 'loading':
      // Simulate long loading for loading state stories
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockSubventionsData;

    case 'single':
      return [mockSubventionsData[0]];

    case 'many':
      // Return more data for testing pagination/large datasets
      return Array.from({ length: 50 }, (_, i) => ({
        ...mockSubventionsData[0],
        id: `s${i + 1}`,
        montant: Math.floor(Math.random() * 50000) + 5000,
        objet: `Subvention ${i + 1}`,
      }));

    default:
      // Default case - return all mock data
      return siren
        ? mockSubventionsData.filter((item) => item.id_attribuant === siren)
        : mockSubventionsData;
  }
}
