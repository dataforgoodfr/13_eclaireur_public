import Image from 'next/image';
import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

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
      <div className='flex h-full flex-col justify-between p-3'>
        <div className='flex flex-col'>
          {/* Mobile */}
          <Image src={picto} alt={title} className='pb-2 md:hidden' width={40} height={40} />
          {/* Desktop */}
          <Image src={picto} alt={title} className='pb-2 max-md:hidden' width={48} height={48} />
          <h3 className={`${isCardBig ? 'mb-4' : ''}`}>{title}</h3>
          <p className={isCardBig ? 'mb-4 font-bold' : ''}>{caption}</p>
          {children}
        </div>
        <div className='my-5 flex justify-center tracking-tighter'>
          <span className='font-bold'>{buttonText}</span>
          <ChevronRight className='ms-2 transition-transform duration-300 group-hover:translate-x-1' />
        </div>
      </div>
    </Link>
  );
}
