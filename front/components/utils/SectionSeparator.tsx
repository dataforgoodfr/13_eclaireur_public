import { YearSelector } from '#app/community/[siren]/comparison/[comparedSiren]/components/shared/YearSelector';

type SectionSeparatorProperties = {
  sectionTitle: string;
  year?: number;
  onSelectYear?: (year: number) => void;
};

export default function SectionSeparator({
  sectionTitle,
  year,
  onSelectYear,
}: SectionSeparatorProperties) {
  return (
    <div className='flex w-full items-center rounded-full'>
      <div className='flex-1 border-b border-gray-300'></div>
      <div className='flex justify-center px-8 py-3 text-lg font-semibold leading-8'>
        {sectionTitle}
        <div className='ml-2'>
          {onSelectYear && year && <YearSelector value={year} onValueChange={onSelectYear} />}
        </div>
      </div>
      <div className='flex-1 border-b border-gray-300'></div>
    </div>
  );
}
