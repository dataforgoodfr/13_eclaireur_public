import { Suspense } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Community } from '@/app/models/community';
import { Input } from '@/components/ui/input';
import { debounce } from '@/utils/utils';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from 'cmdk';
import { Command, Search } from 'lucide-react';

type SuggestedCommunities = Pick<Community, 'nom' | 'siren'>;

type SuggestionsProps = {
  query: string;
  currentPage: number;
  onSelect: (suggestion: SuggestedCommunities) => void;
};

async function Suggestions({ query, currentPage, onSelect }: SuggestionsProps) {
  const suggestions: SuggestedCommunities[] = await fetchFilteredInvoices(query, currentPage);

  return (
    <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
      <Command>
        <CommandList>
          <CommandEmpty>Aucun resultat trouve pour '{query}'</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion) => (
              <CommandItem key={suggestion.siren} onSelect={() => onSelect(suggestion)}>
                {suggestion.nom}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = debounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <Input
      className='pl-8 pr-4'
      placeholder='Entrez une collectivité territoriale'
      defaultValue={searchParams.get('query')?.toString()}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}

type SearchBarProps = {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function SearchBar(props: SearchBarProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className='relative w-4/5'>
      <div className='relative'>
        <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
        <SearchInput />
      </div>
      <Suspense key={query + currentPage} fallback={'chargement'}>
        <Suggestions query={query} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
