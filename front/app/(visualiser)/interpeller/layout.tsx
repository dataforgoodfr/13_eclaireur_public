import { PropsWithChildren } from 'react';

import type { Metadata } from 'next';
import Image from 'next/image';

import { GoToPreviousPage } from '#components/utils/GoToPrevPage';

import { SelectedContactsProvider } from './Contexts/SelectedContactsContext';

export const metadata: Metadata = {
  title: 'Interpeller',
  description: '',
  // TODO - compléter description (facultatif)
};

export default function InterpellateLayout({ children }: PropsWithChildren) {
  return (
    <main>
      <div className='h1-wrapper flex bg-muted-border py-8 md:block md:py-16'>
        <GoToPreviousPage className='md:global-margin mt-2 shrink pl-4 md:mb-8 md:flex md:shrink-0'>
          Retour
        </GoToPreviousPage>
        <h1 className='md:global-margin flex flex-row-reverse items-center md:flex-row'>
          <Image
            src='/eclaireur/call_icon.png'
            width={48}
            height={39}
            alt=''
            className='ml-4 mr-4 md:ml-0 md:mt-[-10]'
          />
          Interpeller
        </h1>
      </div>
      <SelectedContactsProvider>{children}</SelectedContactsProvider>
    </main>
  );
}
