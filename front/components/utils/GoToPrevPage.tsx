'use client';

import Link from 'next/link';
// import { Link } from 'react-router-dom';

import { useRouter } from 'next/navigation';

import { ChevronLeft } from 'lucide-react';

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
      <ChevronLeft /> {children}
    </Link>
  );
}
