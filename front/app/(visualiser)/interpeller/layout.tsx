import type { Metadata } from 'next';

import InterpellateFAQ from '@/components/Interpellate/InterpellateFAQ';

export const metadata: Metadata = {
  title: 'Interpeller - Eclaireur Public',
  description: '',
  // TODO - compléter description (facultatif)
};
export default function InterpellateLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Interpeller</h1>
      {children}
      <InterpellateFAQ />
    </main>
  );
}
