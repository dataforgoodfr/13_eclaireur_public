'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

// import { usePathname } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
// import { loadContacts } from '@/utils/localStorage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonBackAndForth = {
  linkto: string;
  direction: 'back' | 'forth';
  children: React.ReactNode;
};
export default function ButtonBackAndForth({ linkto, direction, children }: ButtonBackAndForth) {
  // TODO : disable "CONTINUER" link when no contact had been added
  // const pathname = usePathname();
  // const [registeredContacts, setRegisteredContacts] = useState(loadContacts);
  // const [isBlocked, setIsBlocked] = useState(false);
  // useEffect(() => {
  //   console.log('USEEFFECTS !!!');
  // }, []);
  // useEffect(() => {
  //   console.log('USEEFFECTS registeredContacts !!!');
  // }, [registeredContacts]);
  // use blocking navigation technique https://nextjs.org/docs/app/api-reference/components/link#blocking-navigation onNavigate !!!

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
