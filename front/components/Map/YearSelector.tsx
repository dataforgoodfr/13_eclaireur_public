'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import { AVAILABLE_YEARS } from '#utils/constants/years';

interface YearSelectorProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export default function YearSelector({ selectedYear, onSelectYear }: YearSelectorProps) {
  return (
    <div className='mb-4 lg:mb-8'>
      <div className='mb-2 flex items-center lg:mb-4'>
        <span className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary font-kanit-bold text-sm font-bold text-white'>
          2
        </span>
        <h4 className='text-sm text-primary lg:text-base'>... une année</h4>
      </div>
      <Select
        value={selectedYear.toString()}
        onValueChange={(value) => onSelectYear(Number(value))}
      >
        <SelectTrigger className='w-full rounded border border-black bg-white px-2 px-3 py-1 py-2 text-sm font-medium text-primary focus:ring-2 focus:ring-primary lg:w-[280px] lg:px-3 lg:py-2 lg:text-base'>
          <SelectValue placeholder='Sélectionnez une année' />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_YEARS.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
