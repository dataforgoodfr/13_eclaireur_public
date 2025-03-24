import { Community } from '@/app/models/community';
import { useCommunitiesBySearch } from '@/utils/hooks/useCommunitiesSearch';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';

type SuggestionsProps = {
  query: string;
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type'>) => void;
};

export default function Suggestions({ query, onSelect }: SuggestionsProps) {
  const { data: suggestions, isPending, isError } = useCommunitiesBySearch(query);

  if (isPending) return 'Chargement...';
  if (isError) return 'Erreur';

  return (
    <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
      <Command>
        <CommandList>
          <CommandEmpty>Aucun resultat trouve pour '{query}'</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem key={suggestion.siren} onSelect={(e) => onSelect(suggestion)}>
                {suggestion.nom} - {suggestion.type}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
