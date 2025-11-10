import { getQueryFromPool } from '#utils/__mocks__/db';
import { fetchMarchesPublics } from '#utils/fetchers/marches-publics/__mocks__/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/__mocks__/fetchMarchesPublicsAvailableYears';
import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';

import { FicheMarchesPublics } from './FicheMarchesPublics';

const yearlyAmountsData = [
  { year: 2019, amount: 1820000 },
  { year: 2020, amount: 1450000 },
  { year: 2021, amount: 2230000 },
  { year: 2022, amount: 4780000 },
  { year: 2023, amount: 1010000 },
  { year: 2024, amount: 1860000 },
  { year: 2025, amount: 660000 },
  { year: null, amount: 640000 },
];

const yearlyCountsData = [
  { year: 2019, count: 182 },
  { year: 2020, count: 145 },
  { year: 2021, count: 223 },
  { year: 2022, count: 478 },
  { year: 2023, count: 101 },
  { year: 2024, count: 186 },
  { year: 2025, count: 66 },
  { year: null, count: 64 },
];

const mockData = [
  {
    id_mp: 1,
    acheteur_id: '213105554',
    objet: "Construction d'une école primaire",
    titulaire_denomination_sociale: 'Entreprise BTP Sud',
    montant_du_marche_public: 1500000,
    montant_du_marche_public_par_titulaire: 1500000,
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
    id_mp: 2,
    acheteur_id: '213105554',
    objet: 'Fourniture de matériel informatique',
    titulaire_denomination_sociale: 'Tech Solutions',
    montant_du_marche_public: 50000,
    montant_du_marche_public_par_titulaire: 50000,
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
    id_mp: 3,
    acheteur_id: '213105554',
    objet: 'Prestations de nettoyage des locaux',
    titulaire_denomination_sociale: 'Propre Service',
    montant_du_marche_public: 25000,
    montant_du_marche_public_par_titulaire: 25000,
    codecpv: '90910000-9',
    cpv_8: '90910000',
    cpv_8_label: 'Services de nettoyage',
    cpv_2: '90',
    cpv_2_label:
      "Services d'assainissement, d'enlèvement des déchets, de désinfection et de dératisation",
    annee_notification: 2023,
    annee_publication_donnees: 2023,
    source: 'BOAMP',
  },
];

const meta = {
  component: FicheMarchesPublics,
  parameters: {
    react: {
      rsc: true,
    },
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/yearly_counts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyCountsData);
          }
          return HttpResponse.json([]);
        }),
        http.get('/api/communities/:siren/marches_publics/yearly_amounts', ({ params }) => {
          const { siren } = params;
          if (siren === '213105554') {
            return HttpResponse.json(yearlyAmountsData);
          }
          return HttpResponse.json([]);
        }),
      ],
    },
  },
  async beforeEach() {
    fetchMarchesPublics.mockResolvedValue(mockData);
    fetchMarchesPublicsAvailableYears.mockResolvedValue([2021, 2022, 2024]);
    getQueryFromPool.mockResolvedValue([{ year: 2021 }, { year: 2022 }, { year: 2025 }]);
  },
  // decorators: [
  //   (Story) => {
  //     return (
  //       <div style={{ width: '800px' }}>
  //         <Suspense fallback={<div>Loading...</div>}>
  //           <Story />
  //         </Suspense>
  //       </div>
  //     );
  //   }
  // ]
} satisfies Meta<typeof FicheMarchesPublics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    siren: '213105554',
  },
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
      },
    },
  },
  decorators: [
    (Story) => {
      fetchMarchesPublics.mockResolvedValue([]);
      fetchMarchesPublicsAvailableYears.mockResolvedValue([]);
      getQueryFromPool.mockResolvedValue([]);

      return <Story />;
    },
  ],
};
