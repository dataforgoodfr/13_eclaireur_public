import { Community } from '@/app/models/community';
import { useCommunitiesBySearch } from '@/utils/hooks/useCommunitiesSearch';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';

type SuggestionsProps = {
  query: string;
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) => void;
};

export default function Suggestions({ query, onSelect }: SuggestionsProps) {
  const { data: suggestions, isPending, isError } = useCommunitiesBySearch(query);

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
            {suggestions?.map((suggestion) => (
              <CommandItem key={suggestion.siren} onSelect={(e) => onSelect(suggestion)}>
                {suggestion.nom} - {suggestion.type} - {suggestion.code_postal}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
