import Image from 'next/image';
import Link from 'next/link';

import { Button } from '#components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '#components/ui/navigation-menu';

import SearchCommunity from '@/components/SearchBar/SearchCommunity';

import { Wrench } from 'lucide-react';
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
const BandeauBeta = () => (
  <div className='fixed z-0 w-full py-1 pl-1 text-sm text-center top-16 bg-card-secondary-foreground-1'>
    <Wrench className='inline scale-x-[-1]' size='16' />
    <strong>Version bêta - ce site est en cours de déploiement.</strong> Certaines
    fonctionnalités peuvent ne pas fonctionner correctement. Merci pour votre compréhension.
  </div>
);
export default function Navbar() {
  const isBeta = true
  return (
    <>
      <div className='fixed z-50 flex items-center justify-between w-full h-16 px-6 py-1 pl-1 bg-white shadow-md lg:px-8'>
        {/* Logo */}
        <Link href='/' className='flex items-center space-x-2'>
          <div className='flex items-center justify-center h-14 w-36'>
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
        {isBeta && <BandeauBeta />}

        {/* Search and Settings */}
        <div className='flex items-center space-x-4'>
          <SearchCommunity />
          <Button
            size='sm'
            className='hidden rounded-none rounded-tl-lg rounded-br-lg bg-primary hover:bg-primary/90 md:inline'
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
    </>
  );
}
