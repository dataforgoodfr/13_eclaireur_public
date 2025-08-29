import type { Community } from '#app/models/community';
import { Card } from '#components/ui/card';

import { CommunityDetails } from '../../../components/CommunityDetails';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
};

export function HeaderComparison({ community1, community2 }: HeaderComparisonProps) {
  return (
    <div className='flex flex-col justify-between gap-8 md:flex-row'>
      <Card className='flex-1 p-8'>
        <CommunityDetails community={community1} compare left />
      </Card>

      <Card className='flex-1 p-8'>
        <CommunityDetails community={community2} compare />
      </Card>
    </div>
  );
}
