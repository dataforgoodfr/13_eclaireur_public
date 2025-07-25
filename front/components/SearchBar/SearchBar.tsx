'use client';

import { type ChangeEvent, useState } from 'react';

import type { Community } from '@/app/models/community';
import { debounce } from '@/utils/utils';
import { Search } from 'lucide-react';

import { Input } from '../ui/input';
import Suggestions from './SearchSuggestions';

type SearchBarProps = {
  className?: string;
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) => void;
};

export default function SearchBar({
  className = 'relative hidden md:block',
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  function handleOnFocus() {
    setIsFocused(true);
  }
  function handleOnBlur() {
    setTimeout(() => setIsFocused(false), 200);
  }

  const handleInputChange = debounce(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    400,
  );
  const showSuggestions = query.length > 0 && isFocused;

  return (
    <div className={className}>
      <div className="relative m-2">
        <div className="flex items-center">
          <Input
            type='search'
            placeholder='Rechercher...'
            className='rounded-none rounded-br-xl rounded-tl-xl border pl-4 text-primary focus:m-0 focus:border-primary focus:ring-primary focus-visible:ring-offset-0'
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            onBlur={(e) => {
              if (e.relatedTarget === null) handleOnBlur();
            }}
          />
          <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary' />
        </div>
        {showSuggestions && <Suggestions query={query} onSelect={onSelect} />}
      </div>
    </div>
  );
}
