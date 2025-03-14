import { Share2 } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='container mx-auto flex items-center px-6 py-2 h-16'>
      <h1 className='text-lg font-bold'>Eclaireur Public</h1>
      <div className='grow'>
        <div className='flex items-center justify-end gap-2 md:gap-8 uppercase'>
          <Link href='/'>Visualiser</Link>
          <Link href='/'>Comprendre</Link>
          <Link href='/'>Télécharger</Link>
          <Link className='border-l pl-2 md:pl-8 border-gray-500' href='/'>À propos</Link>
          <Share2 />
        </div>
      </div>
    </div>
  );
}
