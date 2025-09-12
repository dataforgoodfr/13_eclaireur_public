'use client';

import Link from 'next/link';

import { useSelectedContactsContext } from '#app/(visualiser)/interpeller/Contexts/SelectedContactsContext';
import { buttonVariants } from '#components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ButtonBackAndForth = {
  linkto: string;
  direction: 'back' | 'forth';
  children: React.ReactNode;
  siren?: string;
  step?: number;
};
let linkHref: string;
export default function ButtonBackAndForth({
  linkto,
  direction,
  children,
  step,
}: ButtonBackAndForth) {
  const selectedContactsContext = useSelectedContactsContext();
  const isSelectedContacts = selectedContactsContext.selectedContacts.length > 0 ? true : false;
  const isStep2 = step === 2 ? true : false;

  if (!isStep2) {
    linkHref = linkto;
  }
  if (isStep2) {
    if (isSelectedContacts) {
      linkHref = linkto;
    } else {
      linkHref = '#';
    }
  }

  const disableLinkCSSClassName = !isSelectedContacts && isStep2 ? 'cursor-not-allowed' : '';
  return (
    <Link
      href={linkHref}
      className={buttonVariants({
        variant: 'outline',
        className: `self-start rounded-none rounded-br-xl rounded-tl-xl bg-primary px-2 py-5 font-kanit-bold font-normal text-white ${disableLinkCSSClassName}`,
      })}
      title={!isSelectedContacts ? 'sélectionner au moins un contact' : ''}
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
