'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '#components/ui/button';
import { NavigationMenu, NavigationMenuList } from '#components/ui/navigation-menu';
import SearchCommunity from '@/components/SearchBar/SearchCommunity';
import { Wrench } from 'lucide-react';

import { MobileMenu } from './MobileMenu';
import { NavigationMenuGroup } from './NavigationMenuGroup';

const visualiserMenus = [
  {
    title: 'Cartographie',
    href: '/map',
    description: 'Quelles sont les collectivités les plus transparentes ?',
  },
  {
    title: 'Recherche avancée',
    href: '/advanced-search',
    description: "Comment analyser et télécharger les données d'une collectivité\u00A0?",
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

const comprendreMenus = [
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

const aProposMenus = [
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

const BandeauBeta = ({ onClose }: { onClose: () => void }) => (
  <div className='fixed top-20 z-40 w-full bg-card-secondary-foreground-1 py-1 pl-1 pr-8 text-center text-sm'>
    <Wrench className='inline scale-x-[-1]' size={16} />
    <strong>Version bêta - ce site est en cours de déploiement.</strong> Certaines fonctionnalités
    peuvent ne pas fonctionner correctement. Merci pour votre compréhension.
    <button
      onClick={onClose}
      className='absolute right-2 top-1/2 -translate-y-1/2 transform rounded p-1 hover:bg-white/20'
      aria-label='Fermer le bandeau'
    >
      ✕
    </button>
  </div>
);

export default function Navbar() {
  const [showBetaBanner, setShowBetaBanner] = useState(true);
  const isBeta = true;

  const handleCloseBetaBanner = () => {
    setShowBetaBanner(false);
  };

  return (
    <>
      {isBeta && showBetaBanner && <BandeauBeta onClose={handleCloseBetaBanner} />}

      <div className='fixed top-0 z-50 flex h-20 w-full items-center justify-between border-b bg-white px-4 xl:px-10'>
        {/* Mobile Navbar */}
        <div className='flex w-full items-center justify-between lg:hidden'>
          {/* Left: Icon logo */}
          <Link href='/'>
            <Image
              src='/eclaireur/logo-navmenu-mobile-1.png'
              alt='Éclaireur Icon'
              width={28}
              height={28}
              className='h-[28px] w-auto'
              priority
            />
          </Link>

          {/* Center: Text logo */}
          <Image
            src='/eclaireur/logo-navmenu-mobile-2.svg'
            alt='Éclaireur Public'
            width={360}
            height={36}
            className='h-[68px] w-auto'
            priority
          />

          {/* Right: Burger menu */}
          <MobileMenu
            visualiserMenus={visualiserMenus}
            comprendreMenus={comprendreMenus}
            aProposMenus={aProposMenus}
          />
        </div>

        {/* Desktop Navbar */}
        <div className='hidden w-full items-center lg:flex'>
          {/* Desktop Logo */}
          <Link href='/'>
            <Image
              src='/eclaireur/logo-navmenu-desktop.png'
              priority
              alt='Éclaireur Public Logo'
              className='mb-[3px] h-[50px] w-[142px]'
              width={500}
              height={500}
            />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className='absolute left-1/2 -translate-x-1/2'>
            <NavigationMenuList className='w-[450px]'>
              <NavigationMenuGroup title='Visualiser' menus={visualiserMenus} />
              <NavigationMenuGroup title='Comprendre' menus={comprendreMenus} />
              <NavigationMenuGroup title='À propos' menus={aProposMenus} />
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search + Interpeller button */}
          <div className='absolute right-4 flex items-center space-x-2 xl:right-10 xl:space-x-6'>
            <SearchCommunity className='w-[200px] font-bold' />
            <Button className='hidden h-[56px] w-[56px] rounded-none rounded-br-lg rounded-tl-lg bg-primary hover:bg-primary/90 md:inline'>
              <Link href='/interpeller'>
                <Image src='/eclaireur/interpeller.svg' alt='Interpeller' width={40} height={40} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
