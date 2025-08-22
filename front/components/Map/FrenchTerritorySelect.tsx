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
    <div className='mb-8 lg:mb-8 mb-4'>
      <div className='mb-4 lg:mb-4 mb-2 flex items-center'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold font-kanit-bold text-white'>
          2
        </span>
        <h4 className='text-primary text-sm lg:text-base'>
         Choisissez un territoire
        </h4>
      </div>
      <Select value={selectedTerritory} onValueChange={onSelectTerritory}>
        <SelectTrigger className='w-full lg:w-[280px] rounded border border-black bg-white px-3 py-2 lg:px-3 lg:py-2 px-2 py-1 font-medium text-primary focus:ring-2 focus:ring-primary text-sm lg:text-base'>
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
