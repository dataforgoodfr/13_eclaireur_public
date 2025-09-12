import type { ComponentType } from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { FileText } from 'lucide-react';

import BadgeCommunity from '../../../../../components/Communities/BadgeCommunityPage';
import {
  SCORE_INDICE_COLOR,
  SCORE_TO_ADJECTIF,
  TransparencyScore,
} from '../../../../../components/TransparencyScore/constants';

// Les args de NOS stories (BadgeCommunity n'a pas "score")
type IndiceArgs = { score: TransparencyScore };

const meta: Meta<IndiceArgs> = {
  title: 'Communities/Indice de transparence (Badge)',
  // on fournit bien "component" pour l’onglet Docs,
  // sans utiliser "any" : ComponentType (non générique) suffit
  component: BadgeCommunity as ComponentType,
  parameters: { layout: 'centered' },
  argTypes: {
    score: {
      control: 'inline-radio',
      options: [
        TransparencyScore.A,
        TransparencyScore.B,
        TransparencyScore.C,
        TransparencyScore.D,
        TransparencyScore.E,
      ],
    },
  },
  args: { score: TransparencyScore.E },
};

export default meta;

type Story = StoryObj<IndiceArgs>;

// Template unique pour toutes les stories
const renderBadge = ({ score }: IndiceArgs) => (
  <BadgeCommunity
    text={`Indice de transparence : ${score} - ${SCORE_TO_ADJECTIF[score]}`}
    icon={FileText}
    className={`${SCORE_INDICE_COLOR[score]} text-primary`}
  />
);

export const Playground: Story = { render: renderBadge };
export const A: Story = { args: { score: TransparencyScore.A }, render: renderBadge };
export const B: Story = { args: { score: TransparencyScore.B }, render: renderBadge };
export const C: Story = { args: { score: TransparencyScore.C }, render: renderBadge };
export const D: Story = { args: { score: TransparencyScore.D }, render: renderBadge };
export const E: Story = { args: { score: TransparencyScore.E }, render: renderBadge };
