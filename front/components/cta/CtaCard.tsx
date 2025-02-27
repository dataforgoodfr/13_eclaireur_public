import { ArrowRight } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';

interface CtaCardProps {
  title: string;
  caption: string;
  image: StaticImageData;
  buttonText: string;
  href: string;
}

export default function CtaCard({ title, caption, image, buttonText, href }: CtaCardProps) {
  return (
    <a href={href}>
      <div className='box-border flex h-full w-64 flex-col items-center gap-3 rounded-md bg-neutral-300 p-4'>
        <h3 className='text-lg font-bold'>{title}</h3>
        <p>{caption}</p>
        <div className='relative aspect-square w-full'>
          <Image className='rounded-sm' fill={true} src={image}  alt='Card illustration image'/>
        </div>
        <div className='flex w-full justify-around rounded-sm bg-neutral-600 p-2 text-white'>
          <span>{buttonText}</span>
          <ArrowRight />
        </div>
      </div>
    </a>
  );
}
