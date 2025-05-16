import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { YearOption } from '../types/interface';
import { getAllYearsFrom2018ToCurrent } from '@/utils/utils';

type YearSelectorProps = {
  defaultValue: number | 'All';
  onSelect: (option: YearOption) => void;
};

export default function YearSelector({ defaultValue, onSelect }: YearSelectorProps) {
  return (
    <Select onValueChange={(value) => onSelect(value === 'All' ? 'All' : parseInt(value))}
      defaultValue={defaultValue.toString()}>
      <SelectTrigger className='w-[100px]'>
        <SelectValue placeholder='Tout voir' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='All'>Tout voir</SelectItem>
        {getAllYearsFrom2018ToCurrent().map((year, index) => (
          <SelectItem key={index} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
