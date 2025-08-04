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
  <div className='fixed z-40 w-full py-1 pl-1 text-sm text-center top-16 bg-card-secondary-foreground-1'>
    <Wrench className='inline scale-x-[-1]' size='16' />
    <strong>Version bêta - ce site est en cours de déploiement.</strong> Certaines
    fonctionnalités peuvent ne pas fonctionner correctement. Merci pour votre compréhension.
  </div>
);
export default function Navbar() {
  const isBeta = true
  return (
    <>
      {isBeta && <BandeauBeta />}
      <div className='fixed z-50 flex items-center justify-between w-full h-16 px-6 py-1 pl-1 bg-white shadow-md lg:px-8 top-0'>
        {/* Logo - Different for desktop and mobile */}
        <Link href='/' className='flex items-center space-x-2'>
          {/* Desktop Logo */}
          <div className='hidden md:flex items-center justify-center h-14 w-36'>
            <Image
              src='/eclaireur/logo-navmenu-desktop.png'
              priority
              alt='Éclaireur Public Logo'
              width={340}
              height={100}
            />
          </div>
          {/* Mobile Logo - Part 1 (icon) - 30x35 */}
          <div className='flex md:hidden items-center justify-center'>
            <Image
              src='/eclaireur/logo-navmenu-mobile-1.png'
              priority
              alt='Éclaireur Public Icon'
              width={30}
              height={35}
              className='w-[30px] h-[35px]'
            />
          </div>
        </Link>

        {/* Mobile Logo - Part 2 (text) - Centered on mobile with h-18 (72px) */}
        <div className='absolute left-1/2 transform -translate-x-1/2 md:hidden h-[18px]'>
          <Image
            src='/eclaireur/logo-navmenu-mobile-2.png'
            priority
            alt='Éclaireur Public'
            width={150}
            height={18}
            className='h-[18px] w-auto'
          />
        </div>

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