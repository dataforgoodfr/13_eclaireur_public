import React from 'react';

import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

const visualiserMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Cartographie',
    href: '/map',
    description: 'Quelles sont les collectivités les plus transparentes ?',
  },
  {
    title: 'Recherche avancée',
    href: '/advanced-search',
    description: 'Quelles sont les dépenses publiques dans ma collectivité ?',
  },
  {
    title: 'Interpeller',
    href: '/interpeller',
    description: 'Comment inciter mes élus à plus de transparence ?',
  },
  {
    title: 'Perspectives',
    href: '/',
    description: 'Quelles sont les grandes tendances en matière de transparence des dépenses ?',
  },
];

const comprendreMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Contexte',
    href: '/contexte',
    description: 'Quels sont les enjeux de la transparence des dépenses publiques ?',
  },
  {
    title: 'Méthodologie',
    href: '/methodologie',
    description: 'Comment sont évalués les scores de transparence et tendance de mes collectivités',
  },
  {
    title: 'Cadre réglementaire',
    href: '/cadre-reglementaire',
    description: 'Quelles sont les obligations des collectivités ? ',
  },
];

const aProposMenus: { title: string; href: string; description: string }[] = [
  {
    title: 'Le projet',
    href: '/le-projet',
    description: 'Qui sommes-nous ?',
  },
  {
    title: 'Aide aux élus',
    href: '/aide-aux-elus',
    description: 'Comment améliorer la transparence dans ma collectivité ?',
  },
  {
    title: 'Foire aux questions',
    href: '/faq',
    description: '',
  },
  {
    title: 'Contact',
    href: '/contact',
    description: '',
  },
];

export default function Navbar() {
  return (
    <div className='mx-10 flex flex-row items-center justify-between'>
      <Link className='mr-6' href='/'>
        <h1 className='text-lg font-bold'>Éclaireur Public</h1>
      </Link>
      <NavigationMenu className='flex h-16 items-center py-2'>
        {/* Desktop */}
        <NavigationMenuList className='max-md:hidden'>
          {NavigationMenuGroup('Visualiser', visualiserMenus)}
          {NavigationMenuGroup('Comprendre', comprendreMenus)}
          <NavigationMenuItem>
            <Link href='/advanced-search' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Télécharger
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {NavigationMenuGroup('À propos', aProposMenus)}
        </NavigationMenuList>

        {/* Mobile */}
        <div className='md:hidden'>
          <Sheet>
            <SheetTrigger>
              <Menu />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Éclaireur Public</SheetTitle>
              </SheetHeader>
              <Accordion type='single' collapsible className='w-full'>
                {AccordionMenu('Visualiser', visualiserMenus)}
                {AccordionMenu('Comprendre', comprendreMenus)}
                <Link href='/telecharger'>
                  <p className='border-b py-4 text-left text-lg font-bold hover:underline'>
                    Télécharger
                  </p>
                </Link>
                {AccordionMenu('À propos', aProposMenus)}
              </Accordion>
            </SheetContent>
          </Sheet>
        </div>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={`${className} block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground`}
            {...props}
          >
            <div className='text-sm font-bold leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';

function NavigationMenuGroup(
  headMenuTitle: string,
  menus: { title: string; href: string; description: string }[],
) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{headMenuTitle}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid w-[500px] gap-3 p-4'>
          {menus.map((menu) => (
            <ListItem key={menu.title} title={menu.title} href={menu.href}>
              {menu.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function AccordionMenu(
  headMenuTitle: string,
  menus: { title: string; href: string; description: string }[],
) {
  return (
    <AccordionItem value={headMenuTitle}>
      <AccordionTrigger className='font-bold'>{headMenuTitle}</AccordionTrigger>
      <AccordionContent className='pl-3'>
        <ul className='space-y-3 divide-y divide-gray-200'>
          {menus.map((menu) => (
            <li key={menu.title}>
              <Link href={menu.href}>
                <p className='font-semibold'>{menu.title}</p>
                <p className='text-sm font-light text-gray-500'>{menu.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
