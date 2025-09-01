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
    <div className='flex min-h-screen flex-col items-center bg-primary px-4 pb-20 pt-28 md:pt-40'>
      <div>
        <h2 className='text-center text-3xl text-white md:text-5xl'>Ouuuups ! </h2>
        <h1 className='text-center text-3xl text-white md:text-5xl'>{title}</h1>
      </div>
      <Image
        src={`${errorType === '404' ? '/eclaireur/404.png' : '/eclaireur/500.png'}`}
        width={430}
        height={100}
        alt="Image d'erreur"
        className='w-[280px] md:w-[430px]'
      />
      <p className='w-[300px] text-center text-xl text-white md:w-[600px] md:text-2xl'>
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
  );
}
