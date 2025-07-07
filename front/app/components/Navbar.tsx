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
import { Menu, Wrench } from 'lucide-react';

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
    href: '/perspectives',
    description:
      'Quelles sont les grandes tendances en matière de transparence des dépenses publiques locales ?',
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
    title: 'Qui sommes-nous ?',
    href: '/qui-sommes-nous',
    description: 'Transparency International France, ANTICOR, Data for Good',
  },
  {
    title: 'Le projet',
    href: '/le-projet',
    description: 'Comment la transparence éclaire les citoyens ?',
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
    <div className='fixed z-50 flex h-[100px] w-full flex-wrap justify-between bg-white px-10 shadow'>
      <Link href='/'>
        <h1 className='mt-2 w-[100px] rounded bg-black px-2 py-1 font-bold uppercase text-white'>
          Éclaireur Public
        </h1>
      </Link>
      <NavigationMenu className='flex h-16'>
        {/* Desktop */}
        <NavigationMenuList className='max-md:hidden'>
          <NavigationMenuGroup title='Visualiser' menus={visualiserMenus} />
          <NavigationMenuGroup title='Comprendre' menus={comprendreMenus} />
          <NavigationMenuItem>
            <Link href='/advanced-search' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Télécharger
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuGroup title='À propos' menus={aProposMenus} />
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
                <AccordionMenu title='Visualiser' menus={visualiserMenus} />
                <AccordionMenu title='Comprendre' menus={comprendreMenus} />
                <Link href='/'>
                  <p className='border-b py-4 text-left text-lg font-bold hover:underline'>
                    Télécharger
                  </p>
                </Link>
                <AccordionMenu title='À propos' menus={aProposMenus} />
              </Accordion>
            </SheetContent>
          </Sheet>
        </div>
      </NavigationMenu>
      <div className='absolute bottom-0 left-0 w-full bg-card-secondary-foreground-1 py-1 pl-1 text-center text-sm'>
        <Wrench className='inline scale-x-[-1]' size='16' />
        <strong>Version bêta - ce site est en cours de déploiement.</strong> Certaines
        fonctionnalités peuvent ne pas fonctionner correctement. Merci pour votre compréhension.
      </div>
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

type MenuProps = { title: string; href: string; description: string };

type NavigationMenuGroupProps = {
  title: string;
  menus: MenuProps[];
};

function NavigationMenuGroup({ title, menus }: NavigationMenuGroupProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='w-[500px] gap-3 p-4'>
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

type AccordionMenuProps = {
  title: string;
  menus: MenuProps[];
};

function AccordionMenu({ title, menus }: AccordionMenuProps) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger className='font-bold'>{title}</AccordionTrigger>
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
