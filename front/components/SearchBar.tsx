'use client';

import * as React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const items = [
  { value: 'overview', label: 'Overview' },
  { value: 'projects', label: 'Projects' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'users', label: 'Users' },
];

export function SearchBar() {
  const [query, setQuery] = React.useState('');

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <div className='relative'>
      <div className='relative'>
        <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
        <Input
          className='pl-8 pr-4'
          placeholder='Search...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {query.length > 0 && (
        <div className='absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md'>
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setQuery(item.label);
                      // Perform action here, e.g. navigation
                      console.log(`Selected: ${item.label}`);
                    }}
                  >
                    {item.label}
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
