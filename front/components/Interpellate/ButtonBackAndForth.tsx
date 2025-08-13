import Link from 'next/link';

import { buttonVariants } from '#components/ui/button';
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
        className:
          'self-start rounded-none rounded-br-xl rounded-tl-xl bg-primary px-2 py-5 font-kanit-bold font-normal text-white',
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
