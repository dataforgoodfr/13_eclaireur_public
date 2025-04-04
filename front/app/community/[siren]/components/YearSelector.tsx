import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type YearOption = number | 'All';

export default function YearSelector({
  years,
  onSelect,
}: {
  years: number[];
  onSelect: (option: YearOption) => void;
}) {
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
