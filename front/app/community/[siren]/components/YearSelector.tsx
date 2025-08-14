import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import { getAllYearsFrom2018ToCurrent } from '#utils/utils';

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
      <SelectTrigger className='w-[100px] h-12 rounded-tl-lg rounded-br-lg rounded-tr-none rounded-bl-none bg-white border-gray-300 hover:bg-gray-50'>
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
