import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  title: string;
  caption: string;
  picto: string;
  buttonText: string;
  href: string;
  colorClassName?: string;
}

export default function CtaCard({
  title,
  caption,
  picto,
  buttonText,
  href,
  colorClassName,
}: CtaCardProps) {
  return (
    <Link
      href={href}
      className={`box-border flex h-full w-full flex-col justify-between gap-4 rounded-br-xl rounded-tl-xl p-4 shadow-md ${colorClassName} transition-all duration-300 hover:translate-y-[-10px]`}
    >
      <div className='flex flex-col'>
        <Image src={picto} alt={title} className='w-6 pb-2' width={36} height={36} />
        <h3 className='text-h3'>{title}</h3>
        <p>{caption}</p>
      </div>
      <div className='flex justify-between'>
        <span className='font-bold'>{buttonText}</span>
        <ArrowRight className='transition-transform duration-300 group-hover:translate-x-1' />
      </div>
    </Link>
  );
}
