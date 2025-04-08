import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

type ErrorPageProps = {
  title: string;
  description: string;
  imagePath: string;
  displayContact: boolean;
};

export default function ErrorPage({
  title,
  description,
  imagePath,
  displayContact,
}: ErrorPageProps) {
  return (
    <div className='grid h-[600px] place-content-center justify-items-center bg-white px-4'>
      <Image src={imagePath} width={400} height={400} alt='' className='' />
      <h1 className='text-xl text-gray-700'>{title}</h1>
      <p className='text-gray-800'>{description}</p>
      <Link href={'/'}>
        <Button className='mt-5'>Retour à l'accueil</Button>
      </Link>
    </div>
  );
}
