import { Community } from '@/app/models/community';
import { CommunityType } from '@/utils/types';
import { formatNumberInteger, stringifyCommunityType } from '@/utils/utils';

type HeaderComparisonProps = {
  community1: Community;
  community2: Community;
};

export function HeaderComparison({ community1, community2 }: HeaderComparisonProps) {
  return (
    <div className='flex justify-around'>
      <ComparedHeader
        nom={community1.nom}
        communityType={community1.type}
        population={community1.population}
      />
      <ComparedHeader
        nom={community2.nom}
        communityType={community2.type}
        population={community2.population}
      />
    </div>
  );
}

type ComparedHeaderProperties = {
  nom: string;
  communityType: CommunityType;
  population: number;
};

function ComparedHeader({ nom, communityType: type, population }: ComparedHeaderProperties) {
  return (
    <div className='flex-col text-center'>
      <p className='mb-2 text-xl font-bold'>{nom}</p>
      <p>{stringifyCommunityType(type)}</p>
      <p>{formatNumberInteger(population)} habitants</p>
    </div>
  );
}
