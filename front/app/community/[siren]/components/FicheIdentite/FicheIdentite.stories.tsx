import { TransparencyScore } from '#components/TransparencyScore/constants';
import { getQueryFromPool } from '#utils/__mocks__/db';
import { CommunityType } from '#utils/types';
import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { FicheIdentite } from './FicheIdentite';

const mockCommunity = {
    siren: '213105554',
    type: CommunityType.Commune,
    nom: 'Ville de Test',
    code_insee: '13055',
    code_insee_departement: '13',
    code_insee_region: '93',
    categorie: 'Commune',
    population: 85000,
    superficie_ha: 24000,
    latitude: 43.2965,
    longitude: 5.3698,
    mp_score: TransparencyScore.A,
    subventions_score: TransparencyScore.B,
    siren_epci: '200054807',
    naf8: '84.11Z',
    tranche_effectif: 500,
    id_datagouv: 'test-id',
    url_platfom: 'https://data.test-ville.fr',
    techno_platfom: 'udata',
    effectifs_sup_50: true,
    should_publish: true,
    outre_mer: false,
    code_postal: 13000
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
    code_postal: null
};

const neighboursMockData = [
    {
        longitude: 5.4,
        latitude: 43.3,
        nom: 'Ville Voisine 1'
    },
    {
        longitude: 5.5,
        latitude: 43.4,
        nom: 'Ville Voisine 2'
    }
];

const meta = {
    component: FicheIdentite,
    async beforeEach() {
        getQueryFromPool.mockImplementation((query, params) => {
            if (params && params.length === 3) {
                const [lat, lon, radius] = params;
                if (lat === 43.2965 && lon === 5.3698 && radius === 10000) {
                    return neighboursMockData;
                }
            }
            return [];
        });
    },
    parameters: {
        layout: 'centered',
        react: {
            rsc: true,
        },
        msw: {
            handlers: [
                http.get('/api/communities/neighbours', ({ request }) => {
                    const url = new URL(request.url);
                    const lat = url.searchParams.get('lat');
                    const lon = url.searchParams.get('lon');

                    if (lat === '43.2965' && lon === '5.3698') {
                        return HttpResponse.json(neighboursMockData);
                    }
                    return HttpResponse.json([]);
                }),
            ],
        },
        maplibre: {
            style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
        }
    },
    decorators: [
        (Story) => (
            <div style={{ width: '1200px', padding: '2rem' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof FicheIdentite>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        community: mockCommunity,
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
        }
    ]
};
