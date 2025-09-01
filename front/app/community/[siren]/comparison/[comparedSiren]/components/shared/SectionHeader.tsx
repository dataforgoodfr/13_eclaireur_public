import { Separator } from '#components/ui/separator';

import { YearSelector } from './YearSelector';

type SectionHeaderProps = {
  title: string;
  year: number;
  onYearChange: (year: number) => void;
  availableYears?: number[];
  className?: string;
};

export function SectionHeader({
  title,
  year,
  onYearChange,
  availableYears,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>{title}</h2>
        <YearSelector value={year} onValueChange={onYearChange} availableYears={availableYears} />
      </div>
      <Separator className='bg-gray-200' />
    </div>
  );
}
