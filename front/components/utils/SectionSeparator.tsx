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
    <>
      <div className='flex flex-col-reverse items-center gap-3 md:w-full md:flex-row md:items-center'>
        <h2 className='font-semibold leading-8'>{sectionTitle}</h2>
        <div className='hidden flex-1 border-b border-gray-300 md:mx-4 md:block' />
        {onSelectYear && year && (
          <div className='flex w-full items-center gap-3 md:w-auto'>
            <div className='h-px flex-1 bg-gray-300 md:hidden' />
            <YearSelector className='h-12 w-20' value={year} onValueChange={onSelectYear} />
            <div className='h-px flex-1 bg-gray-300 md:hidden' />
          </div>
        )}
      </div>
    </>
  );
}
