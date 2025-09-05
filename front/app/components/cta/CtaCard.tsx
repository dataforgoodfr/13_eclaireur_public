import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  title: string;
  caption: string;
  isCardBig?: boolean;
  picto: string;
  buttonText: string;
  href: string;
  colorClassName?: string;
  children?: React.ReactNode;
}

export default function CtaCard({
  title,
  caption,
  isCardBig = false,
  picto,
  buttonText,
  href,
  colorClassName,
  children,
}: CtaCardProps) {
  return (
    <Link
      href={href}
      className={`box-border flex h-full w-full flex-col justify-between gap-4 rounded-br-xl rounded-tl-xl shadow-md ${colorClassName} transition-all duration-300 hover:translate-y-[-10px]`}
    >
      <div className='p-5'>
        <div className='flex flex-col'>
          <Image src={picto} alt={title} className='w-6 pb-2' width={36} height={36} />
          <h3 className={`${isCardBig ? 'mb-4' : ''}`}>{title}</h3>
          <p className={isCardBig ? 'mb-4 font-bold' : ''}>{caption}</p>
          {children}
        </div>
        <div className='flex justify-between'>
          <span className='font-bold'>{buttonText}</span>
          <ArrowRight className='transition-transform duration-300 group-hover:translate-x-1' />
        </div>
      </div>
    </Link>
  );
}
