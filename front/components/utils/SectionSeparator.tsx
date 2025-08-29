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
    <div className='my-3 flex w-full items-center md:my-12'>
      <h2 className='flex justify-center font-semibold leading-8'>{sectionTitle}</h2>
      <span className='mx-4 flex-1 border-b border-gray-300' />
      {onSelectYear && year && (
        <YearSelector className='h-12 w-20' value={year} onValueChange={onSelectYear} />
      )}
    </div>
  );
}
