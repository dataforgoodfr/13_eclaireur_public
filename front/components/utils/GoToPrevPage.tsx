'use client';

import Link from 'next/link';
// import { Link } from 'react-router-dom';

import { useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

export function GoToPreviousPage({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <Link
      href='#'
      className={className}
      onClick={(e) => {
        e.preventDefault();
        router.back();
      }}
    >
      <ArrowLeft className='mr-4 mt-2 md:mt-0' />{' '}
      <span className='hidden md:block'>{children}</span>
    </Link>
  );
}
