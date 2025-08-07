import type { Community } from '#app/models/community';
import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { CircleX, FileText } from 'lucide-react';

import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

const FicheIndentiteEnTete = ({ community }: { community: Community }) => {
  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <div className='order-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Informations générales</h2>
      </div>
      <div className='order-1 mb-2 sm:order-2 sm:mb-0 md:mb-4'>
        {community.should_publish ? (
          <BadgeCommunity
            text='Soumise à l’obligation Loi République Numérique'
            icon={FileText}
            iconSize={12}
            className='bg-brand-2'
          />
        ) : (
          <BadgeCommunity
            text='Non soumise à l’obligation Loi République Numérique'
            icon={CircleX}
            iconSize={12}
            className='bg-red-200'
          />
        )}
      </div>
    </div>
  );
};

export function FicheIdentite({ community }: { community: Community }) {
  return (
    <FicheCard header={<FicheIndentiteEnTete community={community} />}>
      <div className='flex w-full flex-col gap-6 md:flex-row md:gap-16'>
        <div className='order-2 w-full md:order-1 md:w-1/3'>
          <CommunityDetails community={community} />
        </div>
        <div className='order-1 h-64 w-full rounded-lg md:order-2 md:h-auto md:w-2/3'>
          <NeighboursMap community={community} />
        </div>
      </div>
    </FicheCard>
  );
}
