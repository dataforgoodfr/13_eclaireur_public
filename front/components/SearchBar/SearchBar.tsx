'use client';

import { ChangeEvent, useState } from 'react';

import { Community } from '@/app/models/community';
import { debounce } from '@/utils/utils';
import { Search } from 'lucide-react';

import { Input } from '../ui/input';
import Suggestions from './SearchSuggestions';

type SearchBarProps = {
  onSelect: (picked: Pick<Community, 'nom' | 'siren' | 'type'>) => void;
};

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleInputChange = debounce(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    400,
  );

  return (
    <div className='relative w-4/5'>
      <div className='relative'>
        <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
        <Input
          className='pl-8 pr-4'
          placeholder='Entrez une collectivité territoriale'
          onChange={handleInputChange}
        />
      </div>
      {query.length > 0 && <Suggestions query={query} onSelect={onSelect} />}
    </div>
  );
}
