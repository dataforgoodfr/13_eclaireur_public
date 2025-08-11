import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import Distribution from './Distribution';

const cpv2Data = [
  {
    "cpv_2": "30",
    "cpv_2_label": "Machines, matériel et fourniture informatique et de bureau, excepté les meubles et logiciels",
    "montant": 4075802.93,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "71",
    "cpv_2_label": "Services d'architecture, services de construction, services d'ingénierie et services d'inspection",
    "montant": 3825200.23,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "37",
    "cpv_2_label": "Instruments de musique, articles de sport, jeux, jouets, articles pour artisanat, articles pour travaux artistiques et accessoires",
    "montant": 3156225.5999999996,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "45",
    "cpv_2_label": "Travaux de construction",
    "montant": 2400089.5,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "77",
    "cpv_2_label": "Services agricoles, sylvicoles, horticoles, d'aquaculture et d'apiculture",
    "montant": 2400000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "32",
    "cpv_2_label": "Équipements et appareils de radio, de télévision, de communication, de télécommunication et équipements connexes",
    "montant": 2000000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "90",
    "cpv_2_label": "Services d'évacuation des eaux usées et d'élimination des déchets, services d'hygiénisation et services relatifs à l'environnement",
    "montant": 1974000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "64",
    "cpv_2_label": "Services des postes et télécommunications",
    "montant": 784000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "80",
    "cpv_2_label": "Services d'enseignement et de formation",
    "montant": 160000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "72",
    "cpv_2_label": "Services de technologies de l'information, conseil, développement de logiciels, internet et appui",
    "montant": 75000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  },
  {
    "cpv_2": "79",
    "cpv_2_label": "Services aux entreprises: droit, marketing, conseil, recrutement, impression et sécurité",
    "montant": 40000,
    "grand_total": 20890318.259999998,
    "total_row_count": 11
  }
]
const meta: Meta<typeof Distribution> = {
  component: Distribution,
  parameters: {
    msw: {
      handlers: [
        http.get('/api/communities/:siren/marches_publics/by_cpv_2', ({ params, request }) => {
          const { siren } = params;
          const url = new URL(request.url);
          const limit = url.searchParams.get('limit') || '50';

          if (siren === '213105554') {
            // Return paginated data based on limit
            const limitNum = parseInt(limit);
            return HttpResponse.json(cpv2Data.slice(0, limitNum));
          }
          return HttpResponse.json([]);
        }),
      ],
    },
    docs: {
      description: {
        component: 'Component displaying the distribution of public markets by sector with toggle between graph and table view.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Distribution>;

export const Default: Story = {
  args: {
    siren: '213105554',
    availableYears: [2021, 2022, 2023, 2024],
  },
  parameters: {
    docs: {
      description: {
        story: 'Default state showing the distribution with treemap view.',
      },
    },
  },
};