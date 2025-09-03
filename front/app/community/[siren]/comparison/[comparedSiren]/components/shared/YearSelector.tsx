'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components/ui/select';
import { cn } from '#utils/utils';

type YearSelectorProps = {
  value: number;
  onValueChange: (year: number) => void;
  availableYears?: number[];
  className?: string;
  disabled?: boolean;
};

export function YearSelector({
  value,
  onValueChange,
  availableYears,
  className,
  disabled = false,
}: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const years = availableYears || Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <Select
      value={value.toString()}
      onValueChange={(yearStr) => onValueChange(Number(yearStr))}
      disabled={disabled}
    >
      <SelectTrigger className={cn('w-32', className)}>
        <SelectValue placeholder={value.toString()} />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
