'use client';

import { type ChangeEvent, useEffect, useRef, useState } from 'react';

import { Community } from '#app/models/community';
import { debounce } from '#utils/utils';
import { Search } from 'lucide-react';

import { Input } from '../ui/input';
import Suggestions from './SearchSuggestions';

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) => void;
};

export default function SearchBar({
  className = 'relative hidden md:block',
  placeholder = 'Code postal, commune, département, région',
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOnFocus() {
    setIsFocused(true);
  }

  function handleOnBlur() {
    setTimeout(() => setIsFocused(false), 200);
  }

  // Commenting cos never used
  // function resetSearchBar() {
  //   setQuery('');
  //   setIsFocused(false);
  //   if (inputRef.current) {
  //     inputRef.current.value = '';
  //   }
  // }

  function handleSelect(picked: Pick<Community, 'nom' | 'siren' | 'type' | 'code_postal'>) {
    setQuery(picked.nom);
    if (inputRef.current) {
      inputRef.current.value = picked.nom;
    }
    setIsFocused(false);

    onSelect(picked);
  }

  // Détection de clic extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    if (isFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isFocused]);

  const handleInputChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
  }, 400);
  const showSuggestions = query.length > 0 && isFocused;

  return (
    <div className={className}>
      <div className='relative' ref={searchBarRef}>
        <div className='flex items-center overflow-visible'>
          <Input
            ref={inputRef}
            type='search'
            placeholder={placeholder}
            className='h-14 rounded-none rounded-br-xl rounded-tl-xl border pl-4 pr-6 text-primary placeholder:text-ellipsis placeholder:text-base placeholder:font-semibold placeholder:text-primary focus:m-0 focus:border-primary focus:ring-primary focus-visible:ring-offset-0 lg:placeholder:text-lg'
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            onBlur={(e) => {
              if (e.relatedTarget === null) handleOnBlur();
            }}
          />
          <div className='pointer-events-none absolute right-14 top-1 h-12 w-10 bg-gradient-to-l from-white to-transparent' />
          <div className='ratio-square absolute right-0 top-0 flex h-14 w-14 items-center justify-center rounded-br-xl bg-primary'>
            <Search className='absolute h-4 w-4 text-white' />
          </div>
        </div>
        {showSuggestions && <Suggestions query={query} onSelect={handleSelect} />}
      </div>
    </div>
  );
}
