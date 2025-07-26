

import Link from 'next/link';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '#components/ui/accordion';

type MenuProps = { title: string; href: string; description: string };
type AccordionMenuProps = {
  title: string;
  menus: MenuProps[];
  last?: boolean;
  onMenuClick?: () => void;
};

export function AccordionMenu({ title, menus, last = false, onMenuClick }: AccordionMenuProps) {
  return (
    <AccordionItem value={title} className={`${last ? 'border-0' : 'border-red border-primary-200'}`}>
      <AccordionTrigger className='font-semibold text-lg text-primary hover:text-primary/80 py-4'>
        {title}
      </AccordionTrigger>
      <AccordionContent className='pl-4 pb-4'>
        <ul className='space-y-4'>
          {menus.map((menu) => (
            <li key={menu.title}>
              <Link
                href={menu.href}
                className='block hover:bg-primary-100 rounded-lg p-2 -m-2 transition-colors'
                onClick={onMenuClick}
              >
                <p className='font-medium text-primary hover:text-primary/80 mb-1'>{menu.title}</p>
                {menu.description && (
                  <p className='text-sm text-gray-600 leading-relaxed'>{menu.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
