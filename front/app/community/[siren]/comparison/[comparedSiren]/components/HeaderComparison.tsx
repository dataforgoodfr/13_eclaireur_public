import { Community } from '@/app/models/community';

import { CommunityDetails } from '../../../components/CommunityDetails';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
};

export function HeaderComparison({ community1, community2 }: HeaderComparisonProps) {
  return (
    <div className='flex justify-around'>
      <ComparedHeader community={community1} />
      <ComparedHeader community={community2} />
    </div>
  );
}

type ComparedHeaderProps = {
  community: Community;
};

function ComparedHeader({ community }: ComparedHeaderProps) {
  return (
    <div className='flex-col rounded bg-gray-100 p-3 m-1'>
      <p className='mb-2 text-xl font-bold text-center'>{community.nom}</p>
      <CommunityDetails community={community} />
    </div>
  );
}
