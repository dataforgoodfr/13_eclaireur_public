import type { Community } from '#app/models/community';
import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { CircleX, FileText } from 'lucide-react';
import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

const FicheIndentiteEnTete = ({ community }: { community: Community }) => {
  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <div className="order-2 sm:order-1">
        <h2 className="text-3xl font-extrabold md:text-4xl text-primary">
          Informations générales
        </h2>
      </div>
      <div className="order-1 sm:order-2 md:mb-4 mb-2 sm:mb-0">
        {community.should_publish === true ? (
          <BadgeCommunity
            text="Soumise à l'obligation Loi République Numérique"
            icon={FileText}
            iconSize={12}
            className="bg-brand-2"
          />
        ) : community.should_publish === false ? (
          <BadgeCommunity
            text="Non soumise à l'obligation Loi République Numérique"
            icon={CircleX}
            iconSize={12}
            className="bg-red-200"
          />
        ) : (
          <BadgeCommunity
            text="Information manquante Loi République Numérique"
            icon={CircleX}
            iconSize={12}
            className="bg-gray-200"
          />
        )}
      </div>
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
        <div className="w-full md:w-2/3 h-64 rounded-lg md:h-auto order-1 md:order-2">
          <NeighboursMap community={community} />
        </div>
      </div>
    </FicheCard>
  );
}
