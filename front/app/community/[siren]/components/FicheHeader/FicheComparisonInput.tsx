'use client';

import { useRouter } from 'next/navigation';

import { Community } from '#app/models/community';
import SearchBar from '#components/SearchBar/SearchBar';
import { ActionButton } from '#components/ui/action-button';

type FicheComparisonInput = {
  community: Community;
};

// Constante pour cacher les communes similaires pour le moment
const SHOW_SIMILAR_COMMUNITIES = false;

export function FicheComparisonInput({ community }: FicheComparisonInput) {
  const router = useRouter();

  function goToComparison(comparedSiren: string) {
    router.push(`/community/${community.siren}/comparison/${comparedSiren}`);
  }

  // Communes similaires mockées (cachées pour le moment)
  const similarCommunities = [
    { nom: 'Évian-les-Bains', siren: '123456789' },
    { nom: 'Douvaine', siren: '987654321' },
    { nom: 'Messery', siren: '456789123' },
    { nom: 'Nernier', siren: '789123456' },
  ];

  return (
    <div className='flex flex-col gap-6 p-4'>
      {/* Titre avec nom de la commune */}
      <div className='text-center'>
        <h2 className='mb-2 text-xl font-semibold text-primary'>
          Comparer{' '}
          <span className='rounded-full bg-primary px-3 py-1 text-base text-primary-foreground'>
            {community.nom}
          </span>{' '}
          à
        </h2>
        <p className='text-sm text-primary'>
          Comparer les dernières données de dépenses publiques de vos collectivités locales.
        </p>
      </div>

      {/* Barre de recherche */}
      <div>
        <SearchBar
          className='relative block w-full'
          onSelect={(option) => goToComparison(option.siren)}
        />
      </div>

      {/* Communes similaires (cachées pour le moment) */}
      {SHOW_SIMILAR_COMMUNITIES && (
        <div>
          <h3 className='mb-3 text-sm font-medium text-primary'>Communes similaires</h3>
          <div className='flex flex-wrap gap-2'>
            {similarCommunities.map((commune) => (
              <ActionButton
                key={commune.siren}
                variant='outline'
                text={commune.nom}
                onClick={() => goToComparison(commune.siren)}
                className='rounded-full border-secondary bg-secondary text-primary hover:bg-secondary/80'
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
