import { Community } from '#app/models/community';
import { TransparencyScore } from '#components/TransparencyScore/constants';
import { CommunityType } from '#utils/types';
import type { Meta, StoryObj } from '@storybook/react';
import { FicheIdentite } from './FicheIdentite';

// Mock data for a community
const mockCommunity: Community = {
    siren: '213105554',
    type: CommunityType.Commune,
    nom: 'Commune de Toulouse',
    code_postal: 31000,
    code_insee: '31555',
    code_insee_departement: '31',
    code_insee_region: '76',
    categorie: 'Commune',
    population: 493465,
    latitude: 43.604652,
    longitude: 1.444209,
    mp_score: TransparencyScore.B,
    subventions_score: TransparencyScore.B,
    siren_epci: '243100518',
    naf8: '84.11Z',
    tranche_effectif: 4,
    id_datagouv: 'toulouse-31555',
    url_platfom: 'https://toulouse.fr',
    techno_platfom: 'Drupal',
    effectifs_sup_50: true,
    should_publish: true,
    outre_mer: false,
};

const meta: Meta<typeof FicheIdentite> = {
    // title: 'Community/FicheIdentite',
    component: FicheIdentite,
    parameters: {
    },
    args: {
        community: mockCommunity,
    },
};

export default meta;

type Story = StoryObj<typeof FicheIdentite>;

export const Default: Story = {};
