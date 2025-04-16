import type { Metadata } from 'next';

import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Formulaire de contact',
};

export default function page() {
  return (
    <div className='mx-auto w-full max-w-screen-lg p-6'>
      <h1 className='my-6 text-3xl font-bold'>Contactez-nous</h1>
      <ContactForm />
    </div>
  );
}
