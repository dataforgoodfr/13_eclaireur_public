import { ArrowRight } from 'lucide-react';

interface CtaCardProps {
  title: string;
  caption: string;
  image: string;
  buttonText: string;
  href: string;
}

export default function CtaCard({ title, caption, image, buttonText, href }: CtaCardProps) {
  return (
    <a href={href}>
      <div className='box-border flex h-full w-64 flex-col items-center gap-3 rounded-md bg-neutral-300 p-4'>
        <h3 className='text-lg font-bold'>{title}</h3>
        <p>{caption}</p>
        <div className='aspect-square w-full rounded-sm bg-white'></div>
        <div className='flex w-full justify-around rounded-sm bg-neutral-600 p-2 text-white'>
          <span>{buttonText}</span>
          <ArrowRight />
        </div>
      </div>
    </a>
  );
}
