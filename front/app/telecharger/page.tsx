import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Télécharger',
  description: "Éclaireur Public met à disposition l'ensemble des données utilisées sur le site",
};
export default function Page() {
  return (
    <main className='mx-auto mb-12 w-full max-w-screen-lg p-6' id='interpeller'>
      <h1 className='text-3xl font-bold'>Télécharger</h1>
      <p className="my-12">
        <img src='telecharger.png' width='1259' height='556' alt='' />
      </p>
    </main>
  );
}
