export default function Card({
  title,
  subtitle,
  columns = 1,
  children,
}: {
  title?: string;
  subtitle?: string;
  columns?: number;
  children: React.ReactNode;
}) {
  return (
    <div className='border-color-muted-default mb-6 rounded-2xl border p-6'>
      {title && <h2 className='mb-2'>{title}</h2>}
      {subtitle && <p className='mb-4 font-bold'>{subtitle}</p>}
      <div className={`grid gap-6 grid-cols-${columns}`}>{children}</div>
    </div>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className='mb-4'>{children}</p>;
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

export function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className='border-color-muted-default mb-6 rounded-2xl border p-6'>
      <div className='mb-4 rounded-md border-l-4 border-blue-500 bg-blue-50 p-4'>
        <h3 className='mb-2 font-semibold'>Bon à savoir</h3>
      </div>
      {title && <p className='mb-4 font-bold'>{title}</p>}
      <div className='space-y-4'>{children}</div>
    </div>
  );
}
