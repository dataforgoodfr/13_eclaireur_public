import { Community } from '@/app/models/community';

interface HomepageHeaderProps {
  communities: Community[];
}

export default function HomepageHeader({ communities }: HomepageHeaderProps) {
  return (
    <div className='h-[600px] bg-homepage-header bg-cover object-cover'>
      <div className='global-margin flex h-full flex-col items-center justify-center gap-y-12'>
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-3xl font-semibold'>Eclaireur Public</h1>
          <h2 className='text-xl font-semibold'>Pour une transparence des dépense</h2>
          <p className='text-base italic'>Derniér mise a jour: le 24 février 2025</p>
        </div>
        <div className='flex h-72 w-3/5 flex-col items-center justify-center rounded-2xl border border-black bg-gray-500'>
          <h2 className='mb-6 w-3/4 text-center text-xl font-semibold'>
            Comment les dépense publiques sont-elles réparties autour de chez vous ?
          </h2>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}
