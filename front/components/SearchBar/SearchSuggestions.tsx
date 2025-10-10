import { Community } from '#app/models/community';
import { useCommunitiesBySearch } from '#utils/hooks/useCommunitiesBySearch';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../ui/command';
import Suggestion from './Suggestion';

type SuggestionsProps = {
  query: string;
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) => void;
};

export default function Suggestions({ query, onSelect }: SuggestionsProps) {
  const { data: suggestions, isPending, isError } = useCommunitiesBySearch(query);

  return (
    <div className='absolute left-0 right-0 z-50 mt-1 max-h-[60vh] overflow-auto overscroll-contain rounded-md border bg-popover text-popover-foreground shadow-lg'>
      <Command>
        <CommandList>
          <CommandEmpty>
            {isPending && <span>Chargement...</span>}
            {isError && <span>Erreur</span>}
            {suggestions?.length === 0 && <span>Aucun resultat trouvé pour '{query}'</span>}
          </CommandEmpty>
          <CommandGroup>
            {suggestions?.map((suggestion) => (
              <CommandItem key={suggestion.siren} onSelect={() => onSelect(suggestion)}>
                <Suggestion {...suggestion} />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
