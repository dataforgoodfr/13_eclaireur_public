'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion } from '@radix-ui/react-accordion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Menu, Search } from 'lucide-react';

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
        <div className='md:hidden'>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='rounded-full p-2'>
                        <Menu className='h-5 w-5 text-primary hover:bg-primary/10' />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    sideOffset={8}
                    className='z-50 w-screen max-h-[calc(100vh-5rem)] overflow-auto rounded-none rounded-b-3xl border-none bg-white px-4 py-6 shadow-lg'
                    align='end'
                    side='bottom'
                >
                    {/* Search Bar */}
                    <div className='relative mb-6'>
                        <Input
                            type='search'
                            placeholder='Rechercher...'
                            className='h-12 w-full rounded-none rounded-br-xl rounded-tl-xl border border-primary/20 pl-4 pr-10 text-primary focus:border-primary focus:ring-primary focus-visible:ring-offset-0'
                        />
                        <Search className='absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/60' />
                    </div>

                    {/* Interpeller Button */}
                    <div className='mb-6'>
                        <Button
                            className='h-12 w-full rounded-none rounded-br-xl rounded-tl-xl bg-primary text-lg font-semibold text-white hover:bg-primary/90'
                            onClick={handleMenuClick}
                        >
                            <Link href='/interpeller' className='flex items-center gap-2'>
                                <Image
                                    src='/eclaireur/interpeller.png'
                                    alt='Interpeller'
                                    width={20}
                                    height={20}
                                />
                                Interpeller
                            </Link>
                        </Button>
                    </div>

                    {/* Accordion Menu */}
                    <Accordion type='single' collapsible className='w-full'>
                        <AccordionMenu title='Visualiser' menus={visualiserMenus} onMenuClick={handleMenuClick} />
                        <AccordionMenu title='Comprendre' menus={comprendreMenus} onMenuClick={handleMenuClick} />
                        <div className='border-b border-primary/20'>
                            <Link href='/advanced-search' onClick={handleMenuClick}>
                                <div className='py-4 text-left text-lg font-semibold text-primary transition-colors hover:text-primary/80'>
                                    Télécharger
                                </div>
                            </Link>
                        </div>
                        <AccordionMenu title='À propos' menus={aProposMenus} last={true} onMenuClick={handleMenuClick} />
                    </Accordion>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
