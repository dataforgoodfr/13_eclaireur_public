import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  title: string;
  caption: string;
  image: StaticImageData;
  buttonText: string;
  href: string;
}

export default function CtaCard({ title, caption, image, buttonText, href }: CtaCardProps) {
  return (
    <Link
      href={href}
      className='flex h-full max-w-80 flex-col items-center gap-3 rounded-md bg-neutral-300 px-8 py-4'
    >
      <h2 className='whitespace-nowrap text-3xl font-bold'>{title}</h2>
      <p>{caption}</p>
      <div className='relative aspect-square w-full'>
        <Image className='rounded-sm' fill={true} src={image} alt='Card illustration image' />
      </div>
      <div className='flex w-full justify-around rounded-sm bg-neutral-600 p-2 text-white'>
        <span>{buttonText}</span>
        <ArrowRight />
      </div>
    </Link>
  );
}
