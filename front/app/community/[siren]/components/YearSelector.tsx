import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { YearOption } from '../types/interface';

type YearSelectorProps = {
  years: number[];
  onSelect: (option: YearOption) => void;
};

export default function YearSelector({ years, onSelect }: YearSelectorProps) {
  return (
    <Select onValueChange={(value) => onSelect(value === 'All' ? 'All' : parseInt(value))}>
      <SelectTrigger className='w-[100px]'>
        <SelectValue placeholder='Tout voir' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='All'>Tout voir</SelectItem>
        {years.map((year, index) => (
          <SelectItem key={index} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
