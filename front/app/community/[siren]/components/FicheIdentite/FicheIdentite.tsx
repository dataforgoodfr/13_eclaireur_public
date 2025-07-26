import type { Community } from '#app/models/community';

import { CommunityDetails } from '../CommunityDetails';
import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

type FicheIdentiteProps = {
  community: Community;
};

const FicheIndentiteEnTete = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
      <h2 className='text-3xl md:text-4xl font-extrabold text-primary'>
        Informations générales
      </h2>
      <span className='text-xs sm:text-sm px-3 py-1 mt-2 sm:mt-0 rounded-full bg-lime-200 text-primary font-bold'>
        Soumise à l’obligation Loi République Numérique
      </span>
    </div>
  );
};

export function FicheIdentite({ community }: FicheIdentiteProps) {

  return (
    <FicheCard header={<FicheIndentiteEnTete />}>
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
