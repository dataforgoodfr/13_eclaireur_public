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
      <div className='h1-wrapper bg-muted-border py-16'>
        <GoToPreviousPage className='global-margin mb-8 mt-2 block flex flex-row'>
          Retour
        </GoToPreviousPage>
        <h1 className='global-margin'>
          <Image
            src='/eclaireur/call_icon.png'
            width={48}
            height={39}
            alt=''
            className='mr-4 mt-[-10] inline'
          />
          Interpeller
        </h1>
      </div>
      <SelectedContactsProvider>{children}</SelectedContactsProvider>
    </main>
  );
}
