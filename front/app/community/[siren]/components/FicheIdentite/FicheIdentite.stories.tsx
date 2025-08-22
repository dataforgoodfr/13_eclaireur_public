import { TransparencyScore } from '#components/TransparencyScore/constants';
import { getQueryFromPool } from '#utils/__mocks__/db';
import { CommunityType } from '#utils/types';
import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';

import { FicheIdentite } from './FicheIdentite';

const mockCommunity = {
  siren: '213105554',
  type: CommunityType.Commune,
  nom: 'Toulouse',
  code_insee: '31555',
  code_insee_departement: '31',
  code_insee_region: '76',
  categorie: 'Commune',
  population: 493465,
  superficie_ha: 11830,
  latitude: 43.6045,
  longitude: 1.4442,
  mp_score: TransparencyScore.A,
  subventions_score: TransparencyScore.B,
  siren_epci: '243100518',
  naf8: '84.11Z',
  tranche_effectif: 1000,
  id_datagouv: 'toulouse-id',
  url_platfom: 'https://data.toulouse.fr',
  techno_platfom: 'udata',
  effectifs_sup_50: true,
  should_publish: true,
  outre_mer: false,
  code_postal: 31000,
};

const minimalCommunity = {
  siren: '000000000',
  type: CommunityType.Commune,
  nom: 'Petite Commune',
  code_insee: '00000',
  code_insee_departement: '00',
  code_insee_region: '00',
  categorie: 'Commune',
  population: 1500,
  superficie_ha: 800,
  latitude: null,
  longitude: null,
  mp_score: null,
  subventions_score: null,
  siren_epci: '',
  naf8: '84.11Z',
  tranche_effectif: 10,
  id_datagouv: '',
  url_platfom: '',
  techno_platfom: '',
  effectifs_sup_50: false,
  should_publish: false,
  outre_mer: false,
  code_postal: null,
};

const neighboursMockData = [
  {
    nom: 'Blagnac',
    latitude: 43.6386,
    longitude: 1.3936,
  },
  {
    nom: 'Balma',
    latitude: 43.6178,
    longitude: 1.4998,
  },
  {
    nom: 'Colomiers',
    latitude: 43.6108,
    longitude: 1.3321,
  },
  {
    nom: 'Ramonville-Saint-Agne',
    latitude: 43.5411,
    longitude: 1.475,
  },
  {
    nom: 'Aucamville',
    latitude: 43.6717,
    longitude: 1.4331,
  },
];

const meta = {
  component: FicheIdentite,
  async beforeEach() {
    getQueryFromPool.mockImplementation((query, params) => {
      if (params && params.length === 3) {
        const [lat, lon, radius] = params;
        if (lat === 43.6045 && lon === 1.4442 && radius === 10000) {
          return neighboursMockData;
        }
      }
      return [];
    });
  },
  parameters: {
    react: {
      rsc: true,
    },
    msw: {
      handlers: [
        http.get('/api/communities/neighbours', ({ request }) => {
          const url = new URL(request.url);
          const lat = url.searchParams.get('lat');
          const lon = url.searchParams.get('lon');

          if (lat === '43.6045' && lon === '1.4442') {
            return HttpResponse.json(neighboursMockData);
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    maplibre: {
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    },
  },
} satisfies Meta<typeof FicheIdentite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    community: mockCommunity,
  },
};

export const NonSoumisAObligation: Story = {
  args: {
    community: {
      ...mockCommunity,
      should_publish: false,
    },
  },
};

export const MinimalData: Story = {
  args: {
    community: minimalCommunity,
  },
  decorators: [
    (Story) => {
      getQueryFromPool.mockImplementation(() => []);
      return <Story />;
    },
  ],
};
