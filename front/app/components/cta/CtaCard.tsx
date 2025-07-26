import Image, { StaticImageData } from 'next/image';

import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  title: string;
  caption: string;
  image: StaticImageData;
  buttonText: string;
  href: string;
  colorClassName?: string;
}

export default function CtaCard({
  title,
  caption,
  image,
  buttonText,
  href,
  colorClassName,
}: CtaCardProps) {
  return (
    <div
      className={`box-border flex h-full w-full flex-col items-center gap-3 rounded-lg p-4 shadow-md ${colorClassName}`}
    >
      <h3 className='text-3xl font-bold'>{title}</h3>
      <p>{caption}</p>
      <div className='relative aspect-square w-full'>
        <Image className='rounded-sm' fill={true} src={image} alt='Card illustration image' />
      </div>
      <a
        href={href}
        className='group mb-4 mt-8 flex w-full justify-center space-x-4 rounded-sm bg-neutral-600 p-2 text-white hover:bg-neutral-700'
      >
        <span>{buttonText}</span>
        <ArrowRight className='transition-transform duration-300 group-hover:translate-x-1' />
      </a>
    </div>
  );
}
