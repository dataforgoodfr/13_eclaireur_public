import type { Meta, StoryObj } from '@storybook/react';

import { CommunityDetails } from '../app/community/[siren]/components/CommunityDetails';
import { Community } from '../app/models/community';

const baseCommunity: Community = {
  siren: '223100017',
  type: 'DEP',
  nom: 'Haute-Garonne',
  code_insee: '31',
  code_insee_departement: '31',
  nom_departement: 'Haute-Garonne',
  code_insee_region: '76',
  categorie: '',
  population: 1439027,
  latitude: 43.6,
  longitude: 1.44,
  mp_score: null,
  subventions_score: null,
  siren_epci: '',
  naf8: '',
  tranche_effectif: 0,
  superficie_ha: null,
  id_datagouv: '',
  url_platfom: '',
  techno_platfom: '',
  effectifs_sup_50: false,
  should_publish: true,
  outre_mer: false,
  code_postal: null,
};

const meta: Meta<typeof CommunityDetails> = {
  title: 'Community/CommunityDetails',
  component: CommunityDetails,
};
export default meta;
type Story = StoryObj<typeof CommunityDetails>;

export const Budget_75k: Story = {
  args: { community: baseCommunity, budgetTotal: 75_000 },
};
export const Budget_740k: Story = {
  args: { community: baseCommunity, budgetTotal: 740_000 },
};
export const Budget_7_4M: Story = {
  args: { community: baseCommunity, budgetTotal: 7_400_000 },
};
export const Budget_7_4Bn: Story = {
  args: { community: baseCommunity, budgetTotal: 7_400_000_000 },
};
