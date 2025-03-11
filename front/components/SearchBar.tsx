'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Community } from '@/utils/types';
import { Search } from 'lucide-react';

interface SearchbarProps {
  communities: Community[];
}

export function SearchBar({ communities }: SearchbarProps) {
  const [query, setQuery] = useState('');

  const router = useRouter();

  const filteredItems = useMemo(() => {
    return communities.filter((item) => item.nom.toLowerCase().includes(query.toLowerCase()));
  }, [query, communities]);

  return (
    <div className='relative w-4/5'>
      <div className='relative'>
        <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
        <Input
          className='pl-8 pr-4'
          placeholder='Entrez une collectivité territoriale'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.length > 0 && filteredItems.length !== 1 && (
        <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.siren}
                    onSelect={() => {
                      setQuery(item.nom);

                      router.push(`/community/${item.siren}`);
                      // Perform action here, e.g. navigation
                      console.log(`Selected: ${item.nom}`);
                    }}
                  >
                    {item.nom}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
