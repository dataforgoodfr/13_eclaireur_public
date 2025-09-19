import Image from 'next/image';

export default function ArticleBox({
  headerText,
  headerImagePath,
  HeaderIcon,
  title,
  children,
}: {
  headerText: string;
  headerImagePath?: string;
  HeaderIcon?: React.ElementType;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-6 rounded-2xl border border-primary-light'>
      <div className='mb-4 rounded-t-2xl bg-primary px-4'>
        <div className='flex h-[52px] items-center gap-2'>
          {headerImagePath && (
            <Image src={headerImagePath} alt={headerText} width={28} height={28} />
          )}
          {HeaderIcon && <HeaderIcon className='h-[28px] w-[28px] text-white' />}
          <p className='font-bold text-white'>{headerText}</p>
        </div>
      </div>
      <div className='p-6'>
        {title && <h2 className='mb-4 text-xl font-bold text-primary'>{title}</h2>}
        <div className='space-y-4 text-primary'>{children}</div>
      </div>
    </div>
  );
}
