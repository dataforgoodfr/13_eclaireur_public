import Image from 'next/image';
import Link from 'next/link';

import { Button } from '#components/ui/button';

type ErrorPageProps = {
  title: string;
  description: string;
  errorType: string;
};

export default function ErrorPage({ title, description, errorType }: ErrorPageProps) {
  return (
    <div className='relative -mb-20 min-h-screen bg-primary'>
      <div className='absolute left-1/2 top-[calc(50%-40px)] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center px-4'>
        <div>
          <h2 className='text-center text-3xl text-white md:text-5xl'>Ouuuups ! </h2>
          <h1 className='text-center text-3xl text-white md:text-5xl'>{title}</h1>
        </div>
        <Image
          src={`${errorType === '404' ? '/eclaireur/404.svg' : '/eclaireur/500.svg'}`}
          width={430}
          height={100}
          alt="Image d'erreur"
          className='w-[280px] md:w-[430px]'
        />
        <p className='w-[280px] text-center text-xl text-white md:w-[600px] md:text-2xl'>
          {description}
        </p>
        <Link href={'/'}>
          <Button
            variant='action'
            className='mt-8 bg-[#fbf79f] text-primary drop-shadow-[0_0_30px_rgba(255,221,51,0.8)] hover:bg-[#fbf79f]/80'
          >
            Revenir à la lumière
          </Button>
        </Link>
      </div>
    </div>
  );
}
