import { FicheComparisonInput } from '#app/community/[siren]/components/FicheHeader/FicheComparisonInput';
import GoBack from '#app/community/[siren]/components/GoBack';
import { Community } from '#app/models/community';
import { SimilarCommunity } from '#app/models/comparison';

type FicheHeaderProps = {
  community: Community;
  community2: Community;
  similarCommunityList: SimilarCommunity[];
};

const descriptionText = `Comparer les dernières données de dépenses publiques de vos collectivités locales.`;

export function Header({ community, community2, similarCommunityList }: FicheHeaderProps) {
  // TODO - get and show postal code
  const title = `Comparaison entre ${community.nom} et ${community2.nom}`;
  // TODO - get and show last update date

  return (
    <div className='flex w-full flex-col justify-stretch gap-6 bg-gray-200 p-6 md:flex-row'>
      <GoBack />
      <div className='flex-1 text-center'>
        <p className='text-xl font-bold'>{title}</p>
        <p className='mt-2'>{descriptionText}</p>
        <div className='mx-auto mt-4 w-1/2 text-sm'>
          <FicheComparisonInput community={community} similarCommunityList={similarCommunityList} />
        </div>
      </div>
    </div>
  );
}
