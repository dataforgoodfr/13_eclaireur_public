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
    <div className='mb-4 mb-8 lg:mb-8'>
      <div className='mb-2 mb-4 flex items-center lg:mb-4'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          2
        </span>
        <h4 className='text-sm text-primary lg:text-base'>Choisissez un territoire</h4>
      </div>
      <Select value={selectedTerritory} onValueChange={onSelectTerritory}>
        <SelectTrigger className='w-full rounded border border-black bg-white px-2 px-3 py-1 py-2 text-sm font-medium text-primary focus:ring-2 focus:ring-primary lg:w-[280px] lg:px-3 lg:py-2 lg:text-base'>
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
