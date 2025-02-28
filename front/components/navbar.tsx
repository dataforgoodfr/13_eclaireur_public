import Link from 'next/link';

export default function Navbar() {
  return (
    <div className='sticky top-0 z-50 w-full bg-blue-500'>
      <Link href='/'>
        <div className='global-margin h-full px-4 py-10 text-2xl font-semibold'>
          Eclaireur Public
        </div>
      </Link>
    </div>
  );
}
