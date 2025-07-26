import type { Community } from '#app/models/community';
import { CircleX, FileText } from 'lucide-react';
import { CommunityDetails } from '../CommunityDetails';


import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';


const FicheIndentiteEnTete = ({ community }: { community: Community }) => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <h2 className='text-3xl md:text-4xl font-extrabold text-primary'>
        Informations générales
      </h2>
      {community.should_publish ? (
        <span className='text-xs sm:text-sm px-3 py-1 mt-2 sm:mt-0 rounded-full bg-lime-200 text-primary font-bold flex items-center gap-2'>
          <FileText size={12} />
          Soumise à l’obligation Loi République Numérique
        </span>
      ) : (
        <span className='text-xs sm:text-sm px-3 py-1 mt-2 sm:mt-0 rounded-full bg-red-200 text-primary font-bold  flex items-center gap-2'>
          <CircleX size={12} />
          Non soumise à l’obligation Loi République Numérique
        </span>
      )}
    </div>
  );
};

export function FicheIdentite({ community }: { community: Community }) {

  return (
    <FicheCard header={<FicheIndentiteEnTete community={community} />}>
      <div className="mb-10 flex flex-col-reverse md:flex-row w-full gap-6">
        <section className="w-full md:w-1/3 flex flex-col gap-6">
          <CommunityDetails community={community} />
        </section>
        <section className="w-full md:w-2/3 h-64 md:h-96 rounded-lg overflow-hidden">
          <NeighboursMap community={community} />
        </section>
      </div>

    </FicheCard>
  );
}
