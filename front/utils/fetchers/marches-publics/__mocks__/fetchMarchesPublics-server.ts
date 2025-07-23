// utils/fetchers/marches-publics/__mocks__/fetchMarchesPublics-server.ts
import { MarchePublic } from '@/app/models/marchePublic';
import { MarchesPublicsParams } from '../createSQLQueryParams';

const mockMarchesPublicsData: MarchePublic[] = [
    {
        id: 1,
        acheteur_id: '213105554',
        objet: 'Construction d'une école primaire',
        titulaire_denomination_sociale: 'Entreprise BTP Sud',
        montant: 1500000,
        codecpv: '45210000-2',
        cpv_8: '45210000',
        cpv_8_label: 'Travaux de construction de bâtiments',
        cpv_2: '45',
        cpv_2_label: 'Travaux de construction',
        annee_notification: 2023,
        annee_publication_donnees: 2023,
        source: 'BOAMP',
    },
    {
        id: 2,
        acheteur_id: '213105554',
        objet: 'Fourniture de matériel informatique',
        titulaire_denomination_sociale: 'Tech Solutions',
        montant: 50000,
        codecpv: '30200000-0',
        cpv_8: '30200000',
        cpv_8_label: 'Matériel informatique',
        cpv_2: '30',
        cpv_2_label: 'Machines de bureau et de calcul',
        annee_notification: 2022,
        annee_publication_donnees: 2022,
        source: 'JOUE',
    },
    {
        id: 3,
        acheteur_id: '213105554',
        objet: 'Prestations de nettoyage des locaux',
        titulaire_denomination_sociale: 'Propre Service',
        montant: 25000,
        codecpv: '90910000-9',
        cpv_8: '90910000',
        cpv_8_label: 'Services de nettoyage',
        cpv_2: '90',
        cpv_2_label: 'Services d'assainissement, d'enlèvement des déchets, de désinfection et de dératisation',
        annee_notification: 2023,
        annee_publication_donnees: 2023,
        source: 'BOAMP',
    },
];

/**
 * Mock version of fetchMarchesPublics for Storybook
 * Simulates different scenarios based on the siren/acheteur_id
 */
export async function fetchMarchesPublics(options?: MarchesPublicsParams): Promise<MarchePublic[]> {
    console.log('🎯 Mock fetchMarchesPublics called with options:', options);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const siren = options?.filters?.acheteur_id;
    const year = options?.filters?.annee_notification;

    // Handle different test scenarios
    switch (siren) {
        case 'nodata':
            return [];

        case 'error':
            throw new Error('Failed to fetch public markets data');

        case 'loading':
            // Simulate long loading for loading state stories
            await new Promise(resolve => setTimeout(resolve, 2000));
            return mockMarchesPublicsData;

        case 'single':
            return [mockMarchesPublicsData[0]];

        case 'many':
            // Return more data for testing pagination/large datasets
            return Array.from({ length: 50 }, (_, i) => ({
                ...mockMarchesPublicsData[i % mockMarchesPublicsData.length],
                id: i + 1,
                objet: `Marché Public ${i + 1}`,
                montant: Math.floor(Math.random() * 1000000) + 10000,
            }));

        case 'recent':
            return mockMarchesPublicsData.filter(mp => mp.annee_notification >= 2022);

        default:
            // Default case - return all mock data or filter by siren if provided
            let filteredData = siren
                ? mockMarchesPublicsData.filter(item => item.acheteur_id === siren)
                : mockMarchesPublicsData;

            if (year) {
                filteredData = filteredData.filter(item => item.annee_notification === year);
            }
            return filteredData;
    }
}
