'use client';

import { useRouter } from 'next/navigation';

import type { Community } from '#app/models/community';
import SearchBar from '#components/SearchBar/SearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#components/ui/card';

type ComparisonModificationCardProps = {
  currentCommunity: Community;
  comparedWith: Community;
  className?: string;
};

export function ComparisonModificationCard({
  currentCommunity,
  comparedWith,
  className,
}: ComparisonModificationCardProps) {
  const router = useRouter();

  const handleCommunitySelect = (
    selected: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>,
  ) => {
    router.push(`/community/${currentCommunity.siren}/comparison/${selected.siren}`);
  };

  return (
    <Card
      className={`border-1 mx-auto my-6 w-full max-w-2xl rounded-[20px] border-black md:my-8 ${className || ''}`}
    >
      <CardHeader className='text-center'>
        <CardTitle className='font-kanit-bold text-4xl text-primary'>
          Modifier la ville de comparaison
        </CardTitle>
        <CardDescription className='text-base font-medium text-primary'>
          Comparer les dernières données de dépenses <br /> publiques de vos collectivités locales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex flex-col items-center gap-3 font-kanit-bold text-2xl lg:flex-row'>
          <div className='rounded-full bg-brand-2 px-4 py-2 text-sm font-medium text-primary'>
            {currentCommunity.nom}
          </div>
          <span className='text-primary'>avec</span>
          <SearchBar
            className='w-full'
            placeholder={comparedWith.nom}
            onSelect={handleCommunitySelect}
          />
        </div>
      </CardContent>
    </Card>
  );
}
