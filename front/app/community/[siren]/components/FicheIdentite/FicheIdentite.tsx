import type { Community } from '#app/models/community';
import { CircleX, FileText } from 'lucide-react';

import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

const FicheIndentiteEnTete = ({ community }: { community: Community }) => {
  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Informations générales</h2>
      {community.should_publish ? (
        <span className='mt-2 flex items-center gap-2 rounded-full bg-lime-200 px-3 py-1 text-xs font-bold text-primary sm:mt-0 sm:text-sm'>
          <FileText size={12} />
          Soumise à l’obligation Loi République Numérique
        </span>
      ) : (
        <span className='mt-2 flex items-center gap-2 rounded-full bg-red-200 px-3 py-1 text-xs font-bold text-primary sm:mt-0 sm:text-sm'>
          <CircleX size={12} />
          Non soumise à l’obligation Loi République Numérique
        </span>
      )}
    </div>
  );
};

export function FicheIdentite({
  community,
  className,
}: {
  community: Community;
  className?: string;
}) {
  return (
    <FicheCard header={<FicheIndentiteEnTete community={community} />} className={className}>
      <div className='mb-10 flex w-full flex-col gap-6 md:flex-row'>
        <div className='order-2 w-full md:order-1 md:w-1/3'>
          <CommunityDetails community={community} />
        </div>
        <div className='order-1 h-64 w-full rounded-lg md:order-2 md:h-96 md:w-2/3'>
          <NeighboursMap community={community} />
        </div>
      </div>
    </FicheCard>
  );
}
