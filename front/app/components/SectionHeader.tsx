type SectionHeaderProps = {
  sectionTitle: string | React.ReactNode;
};

export function SectionHeader({ sectionTitle }: SectionHeaderProps) {
  return (
    <div className="flex h-[200px] flex-col justify-center bg-[url('/eclaireur/project_background.webp')] bg-cover bg-center bg-no-repeat lg:h-[300px]">
      <h1 className='mx-auto w-full p-4 md:p-8 xl:max-w-[1128px] xl:p-0'>{sectionTitle}</h1>
    </div>
  );
}
