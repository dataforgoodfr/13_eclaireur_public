import GoBackHome from '#app/advanced-search/components/GoBackHome';

type SectionHeaderProps = {
  sectionTitle: string | React.ReactNode;
  sectionSubTitle?: string | null;
  displayGoBack?: boolean;
};

export function SectionHeader({
  sectionTitle,
  sectionSubTitle = null,
  displayGoBack = false,
}: SectionHeaderProps) {
  return (
    <div className="flex h-[200px] bg-[url('/eclaireur/project_background.webp')] bg-cover bg-center bg-no-repeat lg:h-[300px]">
      <div className='mx-auto my-auto flex w-full flex-col content-center justify-center p-4 md:p-8 xl:max-w-[1128px] xl:p-0'>
        {displayGoBack && (
          <div className='mb-4 md:mb-8'>
            {' '}
            <GoBackHome />{' '}
          </div>
        )}
        <h1 className=' '>{sectionTitle}</h1>
        {sectionSubTitle && (
          <h2 className='max-w-[550px] text-xl font-normal'>{sectionSubTitle}</h2>
        )}
      </div>
    </div>
  );
}
