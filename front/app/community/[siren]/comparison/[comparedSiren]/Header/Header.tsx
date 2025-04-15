import { Community } from '@/app/models/community';

import GoBack from '../../../components/GoBack';

type FicheHeaderProps = {
  community: Community;
  community2: Community;
};

const descriptionText = `Comparer les dernières données de dépenses publiques de vos collectivités locales.`;

export function Header({ community, community2 }: FicheHeaderProps) {
  // TODO - get and show postal code
  const title = `Comparaison entre ${community.nom} et ${community2.nom}`;
  // TODO - get and show last update date
  const lastUpdateText = `Dernière mise à jour le XX/XX/XX`;

  return (
    <div className='flex w-full flex-col justify-stretch gap-6 bg-gray-200 p-6 md:flex-row'>
      <GoBack />
      <div className='flex-1 text-center'>
        <p className='text-xl font-bold'>{title}</p>
        <p className='mb-4 text-gray-500'>{lastUpdateText}</p>
        <p>{descriptionText }</p>
      </div>
    </div>
  );
}
