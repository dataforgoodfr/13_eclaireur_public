import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Contracts from './Contracts';

const mockContractsData = [
  {
    id: 1,
    acheteur_id: '213105554',
    objet: 'Construction d\'une école primaire',
    titulaire_names: ['Entreprise BTP Sud'],
    montant: 1500000,
    codecpv: '45210000-2',
    cpv_8: '45210000',
    cpv_8_label: 'Travaux de construction de bâtiments',
    cpv_2: '45',
    cpv_2_label: 'Travaux de construction',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 1,
    rang_marche: 1,
    rang_total: 1,
    total_row_count: 10,
  },
  {
    id: 2,
    acheteur_id: '213105554',
    objet: 'Fourniture de matériel informatique',
    titulaire_names: ['Tech Solutions'],
    montant: 50000,
    codecpv: '30200000-0',
    cpv_8: '30200000',
    cpv_8_label: 'Matériel informatique',
    cpv_2: '30',
    cpv_2_label: 'Machines de bureau et de calcul',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'JOUE',
    rang_montant: 2,
    rang_marche: 2,
    rang_total: 2,
    total_row_count: 10,
  },
  {
    id: 3,
    acheteur_id: '213105554',
    objet: 'Prestations de nettoyage des locaux',
    titulaire_names: ['Propre Service'],
    montant: 25000,
    codecpv: '90910000-9',
    cpv_8: '90910000',
    cpv_8_label: 'Services de nettoyage',
    cpv_2: '90',
    cpv_2_label: 'Services d\'assainissement',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 3,
    rang_marche: 3,
    rang_total: 3,
    total_row_count: 10,
  },
  {
    id: 4,
    acheteur_id: '213105554',
    objet: 'Marché de maîtrise d\'œuvre',
    titulaire_names: ['Cabinet Architecture Plus'],
    montant: 200000,
    codecpv: '71220000-6',
    cpv_8: '71220000',
    cpv_8_label: 'Services d\'architecture',
    cpv_2: '71',
    cpv_2_label: 'Services d\'architecture et d\'ingénierie',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 4,
    rang_marche: 4,
    rang_total: 4,
    total_row_count: 10,
  },
  {
    id: 5,
    acheteur_id: '213105554',
    objet: 'Fourniture de mobilier scolaire',
    titulaire_names: ['Mobilier Education', 'Co-traitant ABC'],
    montant: 75000,
    codecpv: '39160000-1',
    cpv_8: '39160000',
    cpv_8_label: 'Mobilier scolaire',
    cpv_2: '39',
    cpv_2_label: 'Mobilier et appareils ménagers',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 5,
    rang_marche: 5,
    rang_total: 5,
    total_row_count: 10,
  },
  {
    id: 6,
    acheteur_id: '213105554',
    objet: 'Maintenance des systèmes informatiques',
    titulaire_names: ['InfoTech Services'],
    montant: 45000,
    codecpv: '72000000-5',
    cpv_8: '72000000',
    cpv_8_label: 'Services informatiques',
    cpv_2: '72',
    cpv_2_label: 'Services informatiques',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 6,
    rang_marche: 6,
    rang_total: 6,
    total_row_count: 10,
  },
  {
    id: 7,
    acheteur_id: '213105554',
    objet: 'Rénovation de la salle polyvalente',
    titulaire_names: ['Bâtiment Pro', 'Élec Plus'],
    montant: 320000,
    codecpv: '45453000-7',
    cpv_8: '45453000',
    cpv_8_label: 'Travaux de révision et de remise en état',
    cpv_2: '45',
    cpv_2_label: 'Travaux de construction',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 7,
    rang_marche: 7,
    rang_total: 7,
    total_row_count: 10,
  },
  {
    id: 8,
    acheteur_id: '213105554',
    objet: 'Services de restauration scolaire',
    titulaire_names: ['Cuisine Centrale'],
    montant: 180000,
    codecpv: '55500000-5',
    cpv_8: '55500000',
    cpv_8_label: 'Services de cantine et de traiteur',
    cpv_2: '55',
    cpv_2_label: 'Services hôteliers et de restauration',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 8,
    rang_marche: 8,
    rang_total: 8,
    total_row_count: 10,
  },
  {
    id: 9,
    acheteur_id: '213105554',
    objet: 'Transport scolaire',
    titulaire_names: ['Transports Régionaux'],
    montant: 250000,
    codecpv: '60100000-9',
    cpv_8: '60100000',
    cpv_8_label: 'Services de transport routier',
    cpv_2: '60',
    cpv_2_label: 'Services de transport',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 9,
    rang_marche: 9,
    rang_total: 9,
    total_row_count: 10,
  },
  {
    id: 10,
    acheteur_id: '213105554',
    objet: 'Fourniture de matériel pédagogique',
    titulaire_names: ['Éduc Fournitures'],
    montant: 35000,
    codecpv: '39162000-5',
    cpv_8: '39162000',
    cpv_8_label: 'Fournitures scolaires',
    cpv_2: '39',
    cpv_2_label: 'Mobilier et appareils ménagers',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
    rang_montant: 10,
    rang_marche: 10,
    rang_total: 10,
    total_row_count: 10,
  },
];

const meta: Meta<typeof Contracts> = {
  component: Contracts,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/paginated', ({ params, request }) => {
          const { siren } = params;
          const url = new URL(request.url);
          const page = url.searchParams.get('page') || '1';
          const limit = url.searchParams.get('limit') || '10';
          
          if (siren === '213105554') {
            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const startIndex = (pageNum - 1) * limitNum;
            const endIndex = startIndex + limitNum;
            
            return HttpResponse.json(mockContractsData.slice(startIndex, endIndex));
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Component displaying contracts ranked by size with year filtering and pagination.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Contracts>;

export const Default: Story = {
  args: {
    siren: '213105554',
    availableYears: [2021, 2022, 2023, 2024],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state showing the contracts table with pagination.',
      },
    },
  },
};