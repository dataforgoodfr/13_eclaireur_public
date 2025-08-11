import { mobileParams } from '#.storybook/utils.tsx';
import { Community } from '#app/models/community';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { CommunityType } from '#utils/types';
import type { Meta, StoryObj } from '@storybook/react';
import { FicheHeader } from './FicheHeader';

// Mock data for different community types
const mockCommune: Community = {
  siren: '213105554',
  type: CommunityType.Commune,
  nom: 'Thonon les Bains',
  code_postal: 74140,
  code_insee: '74281',
  code_insee_departement: '74',
  nom_departement: 'Haute Savoie',
  code_insee_region: '84',
  categorie: 'Commune',
  population: 35241,
  latitude: 46.371,
  longitude: 6.479,
  mp_score: TransparencyScore.B,
  subventions_score: TransparencyScore.A,
  siren_epci: '200071827',
  naf8: '84.11Z',
  tranche_effectif: 4,
  superficie_ha: 1652,
  id_datagouv: 'thonon-les-bains-74281',
  url_platfom: 'https://ville-thonon.fr',
  techno_platfom: 'Drupal',
  effectifs_sup_50: true,
  should_publish: true,
  outre_mer: false,
};

const mockDepartement: Community = {
  siren: '227400019',
  type: CommunityType.Departement,
  nom: 'Département de la Haute Savoie',
  code_postal: null,
  code_insee: '74',
  code_insee_departement: '74',
  nom_departement: 'Haute Savoie',
  code_insee_region: '84',
  categorie: 'Département',
  population: 807360,
  latitude: 46.0,
  longitude: 6.5,
  mp_score: TransparencyScore.A,
  subventions_score: TransparencyScore.B,
  siren_epci: '',
  naf8: '84.11Z',
  tranche_effectif: 5,
  superficie_ha: 445844,
  id_datagouv: 'Haute Savoie-74',
  url_platfom: 'https://hautesavoie.fr',
  techno_platfom: 'Drupal',
  effectifs_sup_50: true,
  should_publish: true,
  outre_mer: false,
};

const mockRegion: Community = {
  siren: '228400026',
  type: CommunityType.Region,
  nom: 'Région Auvergne-Rhône-Alpes',
  code_postal: null,
  code_insee: '84',
  code_insee_departement: '',
  nom_departement: null,
  code_insee_region: '84',
  categorie: 'Région',
  population: 8032377,
  latitude: 45.5,
  longitude: 4.5,
  mp_score: TransparencyScore.C,
  subventions_score: TransparencyScore.B,
  siren_epci: '',
  naf8: '84.11Z',
  tranche_effectif: 6,
  superficie_ha: 6982264,
  id_datagouv: 'auvergne-rhone-alpes-84',
  url_platfom: 'https://auvergnerhonealpes.fr',
  techno_platfom: 'Drupal',
  effectifs_sup_50: true,
  should_publish: true,
  outre_mer: false,
};

const mockEPCI: Community = {
  siren: '200071827',
  type: CommunityType.CA,
  nom: 'Thonon Agglomération',
  code_postal: null,
  code_insee: '',
  code_insee_departement: '74',
  nom_departement: 'Haute Savoie',
  code_insee_region: '84',
  categorie: 'EPCI',
  population: 87256,
  latitude: 46.371,
  longitude: 6.479,
  mp_score: TransparencyScore.D,
  subventions_score: TransparencyScore.C,
  siren_epci: '',
  naf8: '84.11Z',
  tranche_effectif: 4,
  superficie_ha: 30456,
  id_datagouv: 'thonon-agglomeration-200071827',
  url_platfom: 'https://thononagglo.fr',
  techno_platfom: 'Drupal',
  effectifs_sup_50: true,
  should_publish: true,
  outre_mer: false,
};

const meta: Meta<typeof FicheHeader> = {
  title: 'Community/FicheHeader',
  component: FicheHeader,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    community: {
      description: 'Community data object',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FicheHeader>;

export const Commune: Story = {
  args: {
    community: mockCommune,
  },
};

export const Departement: Story = {
  args: {
    community: mockDepartement,
  },
};

export const Region: Story = {
  args: {
    community: mockRegion,
  },
};

export const EPCI: Story = {
  args: {
    community: mockEPCI,
  },
};

export const CommuneSansCodePostal: Story = {
  args: {
    community: {
      ...mockCommune,
      code_postal: null,
      nom: 'Commune sans code postal',
      nom_departement: 'DEPARTEMENT DU RHONE',
    },
  },
};

export const Mobile: Story = {
  args: {
    community: mockCommune,
  },
  ...mobileParams,
};

export const Desktop: Story = {
  args: {
    community: mockCommune,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktopLarge',
    },
  },
};

export const TabletPortrait: Story = {
  args: {
    community: mockCommune,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tabletPortrait',
    },
  },
};

export const DifferentDepartments: Story = {
  args: {
    community: {
      ...mockCommune,
      nom: 'Commune de Lyon',
      nom_departement: 'DEPARTEMENT DU RHONE',
      code_postal: 69000,
    },
  },
};

export const SansDepartement: Story = {
  args: {
    community: {
      ...mockRegion,
      nom: 'Région sans département',
      nom_departement: null,
    },
  },
};
