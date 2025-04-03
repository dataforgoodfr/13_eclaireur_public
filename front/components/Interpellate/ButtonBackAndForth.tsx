import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonBackAndForth = {
  linkto: string;
  direction: 'back' | 'forth';
  children: React.ReactNode;
};
export default function ButtonBackAndForth({ linkto, direction, children }: ButtonBackAndForth) {
  return (
    <Link
      href={linkto}
      className={buttonVariants({
        variant: 'outline',
        className: 'min-w-[200] bg-black text-white',
      })}
    >
      {direction === 'back' ? (
        <>
          <ChevronLeft />
          {children}
        </>
      ) : (
        <>
          {children}
          <ChevronRight />
        </>
      )}
    </Link>
  );
}
