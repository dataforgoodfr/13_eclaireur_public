'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { TerritoryData } from './MapLayout';

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
    <div>
      <Select value={selectedTerritory} onValueChange={onSelectTerritory}>
        <SelectTrigger className='w-[280px]'>
          <SelectValue placeholder='Select a French territory' />
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
