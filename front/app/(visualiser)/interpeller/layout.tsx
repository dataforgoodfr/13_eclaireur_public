import { PropsWithChildren } from 'react';

import type { Metadata } from 'next';

import InterpellateFAQ from '@/components/Interpellate/InterpellateFAQ';

import { SelectedContactsProvider } from './Contexts/SelectedContactsContext';

export const metadata: Metadata = {
  title: 'Interpeller - Eclaireur Public',
  description: '',
  // TODO - compléter description (facultatif)
};

export default function InterpellateLayout({ children }: PropsWithChildren) {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Interpeller</h1>
      <SelectedContactsProvider>{children}</SelectedContactsProvider>
      <InterpellateFAQ />
    </main>
  );
}
