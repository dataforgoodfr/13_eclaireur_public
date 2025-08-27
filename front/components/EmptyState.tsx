'use client';

import { ActionButton } from '#components/ui/action-button';
import { Megaphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

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
  description = "Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données publics.",
  actionText = "Interpeller",
  actionHref = "/interpeller",
  className = "",
  siren
}) => {
  // Construire l'URL avec le siren si fourni
  const finalHref = siren
    ? `/interpeller/${siren}/step1`
    : actionHref;
  return (
    <div className={`flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border overflow-hidden ${className}`}>
      {/* Bandeau d'alerte */}
      <div className="w-full bg-secondary text-primary rounded-t-2xl p-3 md:p-4 flex items-center gap-3 flex-shrink-0">
        <Image
          src="/eclaireur/error_icon.png"
          alt="Erreur"
          width={28}
          height={28}
          className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0"
        />
        <span className="font-extrabold text-xs md:text-base leading-tight break-words">
          {title}
        </span>
      </div>

      {/* Contenu principal avec padding adaptatif et flex-grow */}
      <div className="p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center flex-grow min-h-0 w-full">
        {/* Icône croix + mascotte */}
        <div className="relative mb-4 md:mb-6 flex-shrink-0">
          {/* Croix en arrière-plan */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-20">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-primary"
                fill="currentColor"
              >
                <rect x="10" y="45" width="80" height="10" rx="5" />
                <rect x="45" y="10" width="10" height="80" rx="5" />
              </svg>
            </div>
          </div>

          {/* Mascotte par-dessus */}
          <div className="relative z-10">
            <Image
              src="/eclaireur/Mascotte-appel.png"
              alt="Mascotte Éclaireur Public"
              width={150}
              height={130}
              className="h-[100px] w-[115px] md:h-[130px] md:w-[150px]"
              priority
            />
          </div>
        </div>

        {/* Titre principal */}
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-primary text-center mb-3 md:mb-4 max-w-xs md:max-w-md px-2 leading-tight">
          Vous pouvez toujours agir !
        </h2>

        {/* Description */}
        <p className="text-xs md:text-sm lg:text-base text-primary text-center mb-4 md:mb-6 max-w-sm md:max-w-lg leading-relaxed px-2">
          {description}
        </p>

        {/* Bouton d'action */}
        <div className="flex-shrink-0">
          <Link href={finalHref}>
            <ActionButton
              icon={<Megaphone className="h-4 w-4" />}
              text={actionText}
              variant="default"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;