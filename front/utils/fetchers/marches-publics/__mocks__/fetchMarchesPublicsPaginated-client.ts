import { PaginatedMarchePublic } from '@/app/models/marchePublic';
import { Pagination } from '../types';

// Mock data for different scenarios
const mockData: Record<string, PaginatedMarchePublic[]> = {
  '213105554': [
    {
      id: 1,
      objet: 'Fourniture de matériel informatique',
      montant: 150000,
      annee_notification: 2023,
      titulaire_names: ['Tech Solutions SARL', 'Digital Services'],
      total_row_count: 25,
    },
    {
      id: 2,
      objet: 'Travaux de rénovation énergétique',
      montant: 850000,
      annee_notification: 2023,
      titulaire_names: ['Bâtiment Écologique'],
      total_row_count: 25,
    },
    {
      id: 3,
      objet: 'Prestations de conseil en organisation',
      montant: 45000,
      annee_notification: 2022,
      titulaire_names: ['Conseil & Management', 'Experts Associés'],
      total_row_count: 25,
    },
    {
      id: 4,
      objet: 'Maintenance des ascenseurs',
      montant: 32000,
      annee_notification: 2023,
      titulaire_names: ['Ascenseurs France'],
      total_row_count: 25,
    },
    {
      id: 5,
      objet: 'Nettoyage des locaux administratifs',
      montant: 28000,
      annee_notification: 2023,
      titulaire_names: ['Propreté Services'],
      total_row_count: 25,
    },
  ],
  'single': [
    {
      id: 1,
      objet: 'Fourniture de matériel informatique',
      montant: 150000,
      annee_notification: 2023,
      titulaire_names: ['Tech Solutions SARL'],
      total_row_count: 1,
    },
  ],
  'many': Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    objet: `Marché public #${i + 1}`,
    montant: 10000 + i * 5000,
    annee_notification: 2020 + (i % 4),
    titulaire_names: [`Fournisseur ${String.fromCharCode(65 + (i % 26))}`],
    total_row_count: 50,
  })),
  'nodata': [],
};

/**
 * Mock function for fetchMarchesPublicsPaginated
 */
export async function fetchMarchesPublicsPaginated(
  communitySiren: string,
  year: number | null,
  pagination: Pagination,
): Promise<PaginatedMarchePublic[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get the base data for this siren
  const baseData = mockData[communitySiren] || mockData['213105554'];
  
  // Filter by year if specified
  const yearFilteredData = year 
    ? baseData.filter(item => item.annee_notification === year)
    : baseData;
  
  // Apply pagination
  const { page, limit } = pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = yearFilteredData.slice(startIndex, endIndex);
  
  // Return paginated data with total count
  return paginatedData.map(item => ({
    ...item,
    total_row_count: yearFilteredData.length,
  }));
}