import type { Community } from '#app/models/community';
import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { CircleX, FileText } from 'lucide-react';
import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

const FicheIndentiteEnTete = ({ community }: { community: Community }) => {
  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <h2 className="text-3xl font-extrabold md:text-4xl text-primary">
        Informations générales
      </h2>
      {community.should_publish ? (
        <BadgeCommunity
          text="Soumise à l’obligation Loi République Numérique"
          icon={FileText}
          iconSize={12}
          className="bg-brand-2"
        />
      ) : (
        <BadgeCommunity
          text="Non soumise à l’obligation Loi République Numérique"
          icon={CircleX}
          iconSize={12}
          className="bg-red-200"
        />
      )}
    </div>
  );
};

export function FicheIdentite({ community }: { community: Community }) {
  return (
    <FicheCard header={<FicheIndentiteEnTete community={community} />}>
      <div className="flex flex-col w-full gap-6 mb-10 md:flex-row">
        <div className="w-full md:w-1/3 order-2 md:order-1">
          <CommunityDetails community={community} />
        </div>
        <div className="w-full md:w-2/3 h-64 rounded-lg md:h-96 order-1 md:order-2">
          <NeighboursMap community={community} />
        </div>
      </div>
    </FicheCard>
  );
}
