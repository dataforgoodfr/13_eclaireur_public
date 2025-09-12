import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

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
        {/* Mobile */}
        <Image src={picto} alt={title} className='pb-2 md:hidden' width={40} height={40} />
        {/* Desktop */}
        <Image src={picto} alt={title} className='pb-2 max-md:hidden' width={48} height={48} />
        <h3 className='text-h3'>{title}</h3>
        <p>{caption}</p>
      </div>
      <div className='flex'>
        <span className='font-bold'>{buttonText}</span>
        <ChevronRight className='ms-2 transition-transform duration-300 group-hover:translate-x-1' />
      </div>
    </Link>
  );
}
