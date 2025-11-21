'use client';

import { FC } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ActionButton } from '#components/ui/action-button';
import { CircleAlert, Megaphone } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  className?: string;
  communityName?: string;
  siren?: string;
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "Oups, il n'y a pas de données sur la collectivité !",
  description = 'Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données publics.',
  actionText = 'Interpeller',
  actionHref = '/interpeller',
  className = '',
  siren,
}) => {
  // Construire l'URL avec le siren si fourni
  const finalHref = siren ? `/interpeller/${siren}/step1` : actionHref;
  return (
    <div
      className={`flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white shadow-sm ${className}`}
    >
      {/* Bandeau d'alerte */}
      <div className='flex w-full flex-shrink-0 items-center gap-3 rounded-t-2xl bg-secondary p-3 text-primary md:p-4'>
        <CircleAlert
          width={28}
          height={28}
          className='h-6 w-6 flex-shrink-0 md:h-7 md:w-7'
        />
        <span className='break-words text-xs font-extrabold leading-tight md:text-base'>
          {title}
        </span>
      </div>

      {/* Contenu principal avec padding adaptatif et flex-grow */}
      <div className='flex min-h-0 w-full flex-grow flex-col items-center justify-center p-4 md:p-6 lg:p-8'>
        {/* Icône croix + mascotte */}
        <div className='relative mb-4 flex-shrink-0 md:mb-6'>
          {/* Croix en arrière-plan */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='h-16 w-16 opacity-20 md:h-20 md:w-20 lg:h-24 lg:w-24'>
              <svg viewBox='0 0 100 100' className='h-full w-full text-primary' fill='currentColor'>
                <rect x='10' y='45' width='80' height='10' rx='5' />
                <rect x='45' y='10' width='10' height='80' rx='5' />
              </svg>
            </div>
          </div>

          {/* Mascotte par-dessus */}
          <div className='relative z-10'>
            <Image
              src='/eclaireur/mascotte_call.svg'
              alt='Mascotte Éclaireur Public'
              width={150}
              height={130}
              className='h-[100px] w-[115px] md:h-[130px] md:w-[150px]'
              priority
            />
          </div>
        </div>

        {/* Titre principal */}
        <h2 className='mb-3 max-w-xs px-2 text-center text-base font-bold leading-tight text-primary md:mb-4 md:max-w-md md:text-xl lg:text-2xl'>
          Vous pouvez toujours agir !
        </h2>

        {/* Description */}
        <p className='mb-4 max-w-sm px-2 text-center text-xs leading-relaxed text-primary md:mb-6 md:max-w-lg md:text-sm lg:text-base'>
          {description}
        </p>

        {/* Bouton d'action */}
        <div className='flex-shrink-0'>
          <Link href={finalHref}>
            <ActionButton
              icon={<Megaphone className='h-4 w-4' />}
              text={actionText}
              variant='default'
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
