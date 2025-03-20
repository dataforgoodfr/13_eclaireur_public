import { Community } from '@/app/models/community';

import { FicheComparisonInput } from './FicheComparisonInput';
import FicheGoBack from './FicheGoBack';

type FicheHeaderProps = {
  community: Community;
};

const decriptionText = `Visualiser les dernières données de dépenses publiques de votre collectivité locale`;

export function FicheHeader({ community }: FicheHeaderProps) {
  // TODO - get and show postal code
  const title = `${community.nom} XXXXX`;
  // TODO - get and show last update date
  const lastUpdateText = `Dernière mise à jour le XX/XX/XX`;

  return (
    <div className='w-fulljustify-stretch flex flex-col gap-6 bg-yellow-600 p-6 md:flex-row'>
      <FicheGoBack />
      <div className='flex-1 text-center'>
        <p className='text-xl font-bold'>{title}</p>
        <p className='mb-4 text-gray-500'>{lastUpdateText}</p>
        <p>{decriptionText}</p>
      </div>
      <FicheComparisonInput community={community} />
    </div>
  );
}
