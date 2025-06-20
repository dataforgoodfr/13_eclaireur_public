type SectionSeparatorProperties = {
  sectionTitle: string;
};

export default function SectionSeparator({ sectionTitle }: SectionSeparatorProperties) {
  return (
    <div className='flex w-full items-center rounded-full'>
      <div className='flex-1 border-b border-gray-300'></div>
      <span className='px-8 py-3 text-lg font-semibold leading-8'>{sectionTitle}</span>
      <div className='flex-1 border-b border-gray-300'></div>
    </div>
  );
}
