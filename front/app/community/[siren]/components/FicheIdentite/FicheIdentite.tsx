import { Community } from '@/app/models/community';
import { TransparencyScore } from '@/components/TransparencyScore/constants';

import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';
import { TransparencyScoreWithTrend } from '../TransparencyScore/TransparencyScore';

type FicheIdentiteProps = {
  community: Community;
};

const ficheTitle = `Fiche identité`;

export function FicheIdentite({ community }: FicheIdentiteProps) {
  // TODO - get and add the last update date
  const lastUpdateText = `Derniere mise a jour`;
  // TODO - retrieve scores
  const score = TransparencyScore.B;
  const trend = 1;

  return (
    <FicheCard title={ficheTitle} displayCopyUrl={true}>
      <div className='mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-start'>
        <CommunityDetails community={community} />
        <NeighboursMap community={community} />
      </div>
      <TransparencyScoreWithTrend score={score} trend={trend} />
    </FicheCard>
  );
}
