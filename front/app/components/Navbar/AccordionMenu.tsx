import Link from 'next/link';

import { AccordionContent, AccordionItem, AccordionTrigger } from '#components/ui/accordion';

type MenuProps = { title: string; href: string; description: string };
type AccordionMenuProps = {
  title: string;
  menus: MenuProps[];
  last?: boolean;
  onMenuClick?: () => void;
};

export function AccordionMenu({ title, menus, last = false, onMenuClick }: AccordionMenuProps) {
  return (
    <AccordionItem
      value={title}
      className={`${last ? 'border-0' : 'border-red border-primary-200'}`}
    >
      <AccordionTrigger className='py-4 text-lg font-semibold text-primary hover:text-primary/80'>
        {title}
      </AccordionTrigger>
      <AccordionContent className='pb-4 pl-4'>
        <ul className='space-y-4'>
          {menus.map((menu) => (
            <li key={menu.title}>
              <Link
                href={menu.href}
                className='-m-2 block rounded-lg p-2 transition-colors hover:bg-primary-100'
                onClick={onMenuClick}
              >
                <p className='mb-1 font-medium text-primary hover:text-primary/80'>{menu.title}</p>
                {menu.description && (
                  <p className='text-sm leading-relaxed text-gray-600'>{menu.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
