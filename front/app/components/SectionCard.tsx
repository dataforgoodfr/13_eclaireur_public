import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

export default function Card({
  title,
  subtitle,
  columns = 1,
  children,
  knowMore,
}: {
  title?: string;
  subtitle?: string;
  columns?: number;
  children: React.ReactNode;
  knowMore?: string;
}) {
  return (
    <div className='mb-6 rounded-2xl border border-muted-default p-6'>
      {title && <h2 className='mb-4'>{title}</h2>}
      {subtitle && <h4 className='mb-4'>{subtitle}</h4>}
      <div className={`grid gap-6 grid-cols-${columns}`}>{children}</div>
      {knowMore && <KnowMore href={knowMore} />}
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className='list-disc space-y-1 pl-5'>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

export function KnowMore({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className='my-4 flex w-40 items-center justify-center rounded-br-xl rounded-tl-xl border border-primary-light bg-white p-2'
    >
      <span className='me-2 font-bold'>En savoir plus</span>
      <ArrowRight />
    </Link>
  );
}
