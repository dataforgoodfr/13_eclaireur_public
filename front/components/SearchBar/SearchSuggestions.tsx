import { useRouter } from 'next/navigation';

import { useCommunitiesBySearch } from '@/utils/hooks/useCommunitiesSearch';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';

type SuggestionsProps = {
  query: string;
};

export default function Suggestions({ query }: SuggestionsProps) {
  const router = useRouter();
  const { data: suggestions, isPending, isError } = useCommunitiesBySearch(query);

  function navigateToCommunityPage(siren: string) {
    router.push(`/community/${siren}`);
  }

  console.log(query, suggestions);

  return (
    <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
      <Command>
        <CommandList>
          <CommandEmpty>
            {isPending && <span>Chargement...</span>}
            {isError && <span>Erreur</span>}
            {suggestions?.length === 0 && <span>Aucun resultat trouve pour '{query}'</span>}
          </CommandEmpty>
          <CommandGroup>
            {suggestions?.map(({ nom, siren, type }) => (
              <CommandItem key={siren} onSelect={() => navigateToCommunityPage(siren)}>
                {nom} - {type} - {siren}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
