'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';

import type { TerritoryData } from './types';

interface TerritorySelectProps {
  territories: Record<string, TerritoryData>;
  selectedTerritory: string | undefined;
  onSelectTerritory: (territoryKey: string) => void;
}

export default function FrenchTerritoriesSelect({
  territories,
  selectedTerritory,
  onSelectTerritory,
}: TerritorySelectProps) {
  return (
    <div className='mb-8'>
      <div className='mb-4 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold font-kanit-bold text-white'>
          2
        </span>
        <h4 className='text-primary'>
         Choisissez un territoire
        </h4>
      </div>
      <Select value={selectedTerritory} onValueChange={onSelectTerritory}>
        <SelectTrigger className='w-[280px] rounded border border-black bg-white px-3 py-2 font-medium text-primary focus:ring-2 focus:ring-primary'>
          <SelectValue placeholder='Sélectionnez la France métropolitaine ou un territoire d’outre-mer' />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(territories).map(([key, territory]) => (
            <SelectItem key={key} value={key}>
              {territory.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
