import type { Community } from '#app/models/community';

import { CommunityDetails } from '../../../components/CommunityDetails';
import { ComparisonCard } from './shared/ComparisonCard';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
};

export function HeaderComparison({ community1, community2 }: HeaderComparisonProps) {
  return (
    <div className='flex justify-around gap-4 max-md:my-6 md:my-10'>
      <ComparisonCard
        title={community1.nom}
        variant='primary'
        size='md'
        className='max-w-md flex-1'
      >
        <CommunityDetails community={community1} />
      </ComparisonCard>

      <ComparisonCard
        title={community2.nom}
        variant='secondary'
        size='md'
        className='max-w-md flex-1'
      >
        <CommunityDetails community={community2} />
      </ComparisonCard>
    </div>
  );
}
