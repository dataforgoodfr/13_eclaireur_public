import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllYearsFrom2018ToCurrent } from '@/utils/utils';

import { YearOption } from '../types/interface';

type YearSelectorProps = {
  defaultValue: YearOption;
  onSelect: (option: YearOption) => void;
  displayAll?: boolean;
};

export default function YearSelector({
  defaultValue,
  onSelect,
  displayAll = true,
}: YearSelectorProps) {
  return (
    <Select
      onValueChange={(value) => onSelect(value === 'All' ? 'All' : parseInt(value))}
      defaultValue={defaultValue.toString()}
    >
      <SelectTrigger className='w-[100px]'>
        <SelectValue placeholder='Tout voir' />
      </SelectTrigger>
      <SelectContent>
        {displayAll && <SelectItem value='All'>Tout voir</SelectItem>}
        {getAllYearsFrom2018ToCurrent().map((year, index) => (
          <SelectItem key={index} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
