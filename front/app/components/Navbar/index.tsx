import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Search } from 'lucide-react';

import { MobileMenu } from './MobileMenu';
import { NavigationMenuGroup } from './NavigationMenuGroup';

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
    <div className='fixed z-50 w-full border-b bg-white shadow-sm'>
      <div className='flex h-16 items-center justify-between px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <div className='flex h-14 w-36 items-center justify-center'>
            <Image
              src='/eclaireur/logo-navmenu.png'
              priority
              alt='Éclaireur Public Logo'
              width={340}
              height={100}
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className='hidden md:flex'>
          <NavigationMenuList>
            <NavigationMenuGroup title='Visualiser' menus={visualiserMenus} />
            <NavigationMenuGroup title='Comprendre' menus={comprendreMenus} />
            <NavigationMenuItem className='hidden lg:flex'>
              <Link href='/advanced-search' legacyBehavior passHref>
                <NavigationMenuLink className='text-base font-medium text-primary hover:text-primary/80'>
                  Télécharger
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuGroup title='À propos' menus={aProposMenus} />
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search and Settings */}
        <div className='flex items-center space-x-4'>
          <div className='relative hidden md:block'>

            <Input
              type='search'
              placeholder='Rechercher...'
              className='w-64 rounded-none rounded-br-xl rounded-tl-xl border pl-4 pr-10 text-primary focus:m-0 focus:border-primary focus:ring-primary focus-visible:ring-offset-0'
            />
            <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 border-primary text-primary focus:border-primary' />
          </div>
          <Button
            size='sm'
            className='hidden rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90 md:inline'
          >
            <Link
              href='/interpeller'
            >
              <Image
                src='/eclaireur/interpeller.svg'
                alt='Interpeller'
                width={20}
                height={20}
              />
            </Link>
          </Button>
          {/* Mobile Menu */}
          <MobileMenu
            visualiserMenus={visualiserMenus}
            comprendreMenus={comprendreMenus}
            aProposMenus={aProposMenus}
          />
        </div>
      </div>
    </div>
  );
}
