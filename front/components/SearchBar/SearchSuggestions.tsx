import { useRouter } from 'next/navigation';

import { useCommunitiesBySearch } from '@/utils/hooks/useCommunitiesSearch';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';

type SuggestionsProps = {
  query: string;
};

export default function Suggestions({ query }: SuggestionsProps) {
  const router = useRouter();
  const { data: suggestions, isPending, isError } = useCommunitiesBySearch(query);

  if (isPending) return 'Chargement...';
  if (isError) return 'Erreur';

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  console.log(query, suggestions);

  return (
    <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
      <Command>
        <CommandList>
          <CommandEmpty>Aucun resultat trouve pour '{query}'</CommandEmpty>
          <CommandGroup>
            {suggestions.map(({ nom, siren, type }) => (
              <CommandItem key={siren} onSelect={() => navigateToCommunityPage(siren)}>
                {nom} - {type}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
