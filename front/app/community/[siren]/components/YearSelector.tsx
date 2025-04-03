import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type YearOption = number | 'All';

export default function YearSelector({
  availableYears,
  setSelectedYear,
}: {
  availableYears: number[];
  setSelectedYear: React.Dispatch<React.SetStateAction<YearOption>>;
}) {
  return (
    <Select onValueChange={(value) => setSelectedYear(value === 'All' ? 'All' : parseInt(value))}>
      <SelectTrigger className='w-[100px]'>
        <SelectValue placeholder='Tout voir' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='All'>Tout voir</SelectItem>
        {availableYears.map((year, index) => (
          <SelectItem key={index} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
