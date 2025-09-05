'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '#components/ui/button';
import { Accordion } from '@radix-ui/react-accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Menu } from 'lucide-react';

import { AccordionMenu } from './AccordionMenu';

type MenuProps = { title: string; href: string; description: string };

interface MobileMenuProps {
  visualiserMenus: MenuProps[];
  comprendreMenus: MenuProps[];
  aProposMenus: MenuProps[];
}

export function MobileMenu({ visualiserMenus, comprendreMenus, aProposMenus }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <div className='lg:hidden'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='rounded-full p-2 -indent-[1100px] hover:bg-primary/10'
          >
            <Menu className='container !h-6 !w-6 text-primary' />
            Menu
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          sideOffset={8}
          className='z-50 max-h-[calc(100vh-5rem)] w-screen overflow-auto rounded-none rounded-b-3xl border-none bg-white px-4 py-6 shadow-lg'
          align='end'
          side='bottom'
        >
          {/* Interpeller Button */}
          <div className='mb-6'>
            <Button
              className='h-12 w-full rounded-none rounded-br-xl rounded-tl-xl bg-primary text-lg font-semibold text-white hover:bg-primary/90'
              onClick={handleMenuClick}
            >
              <Link href='/interpeller' className='flex items-center gap-2'>
                <Image src='/eclaireur/interpeller.png' alt='Interpeller' width={20} height={20} />
                Interpeller
              </Link>
            </Button>
          </div>

          {/* Accordion Menu */}
          <Accordion type='single' collapsible className='w-full'>
            <AccordionMenu
              title='Visualiser'
              menus={visualiserMenus}
              onMenuClick={handleMenuClick}
            />
            <AccordionMenu
              title='Comprendre'
              menus={comprendreMenus}
              onMenuClick={handleMenuClick}
            />
            <AccordionMenu
              title='À propos'
              menus={aProposMenus}
              last={true}
              onMenuClick={handleMenuClick}
            />
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
