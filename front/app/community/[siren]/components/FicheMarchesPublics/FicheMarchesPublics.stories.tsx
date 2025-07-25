
import { getQueryFromPool } from '#utils/db.mock';
import { mockFetchMarchesPublics } from '#utils/fetchers/marches-publics/fetchMarchesPublics-server.mock';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears.mock';
import type { Meta, StoryObj } from '@storybook/react';
import { Suspense } from 'react';
import { FicheMarchesPublics } from './FicheMarchesPublics';

const mockData = [
  {
    id: 1,
    acheteur_id: '213105554',
    objet: 'Construction d\'une école primaire',
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
    cpv_2_label: 'Services d\'assainissement, d\'enlèvement des déchets, de désinfection et de dératisation',
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
  },
];

const meta = {
  component: FicheMarchesPublics,
  parameters: {
    // layout: 'centered',
    react: {
      rsc: true,
      // suspense: true
    }
  },
  async beforeEach() {
    mockFetchMarchesPublics.mockResolvedValue(mockData);
    fetchMarchesPublicsAvailableYears.mockResolvedValue([
      2021, 2022, 2024,
    ]);
    getQueryFromPool.mockResolvedValue([
      { year: 2021 },
      { year: 2022 },
      { year: 2025 },
    ]);
  },
  decorators: [
    (Story) => {
      return (
        <div style={{ width: '800px' }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Story />
          </Suspense>
        </div>
      );
    }
  ]
} satisfies Meta<typeof FicheMarchesPublics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    siren: '213105554',
  },
  // parameters: {
  //   nextjs: {
  //     appDirectory: true,
  //     // navigation: {
  //     //   segments: [['community', '213105554']],
  //     // }
  //   },
  // },
};

export const NoData: Story = {
  args: {
    siren: '000000000',
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        segments: [['community', '000000000']],
      }
    },
  },
  decorators: [
    (Story) => {
      mockFetchMarchesPublics.mockResolvedValue([]);
      fetchMarchesPublicsAvailableYears.mockResolvedValue([]);
      getQueryFromPool.mockResolvedValue([]);

      return <Story />;
    }
  ]
};
