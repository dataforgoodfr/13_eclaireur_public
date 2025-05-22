import { Community } from '@/app/models/community';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';

import { CommunityDetails } from '../../../components/CommunityDetails';

type ComparingFicheProps = {
  community: Community;
};

export function ComparingFiche({ community }: ComparingFicheProps) {
  // TODO - connect to community when in db
  const scoreTODO = TransparencyScore.A;

  return (
    <div className='flex flex-col space-y-[50px] rounded bg-gray-100 p-6'>
      <h5 className='text-center text-lg font-bold'>{community.nom}</h5>
      <CommunityDetails community={community} />
      <TransparencyScoreBar score={scoreTODO} />
    </div>
  );
}
