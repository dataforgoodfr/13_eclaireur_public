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
    <div className={`flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border ${className}`}>
      {/* Bandeau d'alerte */}
      <div className="w-full bg-secondary text-primary rounded-t-2xl p-4 flex items-center gap-3">
        <Image
          src="/eclaireur/error_icon.png"
          alt="Erreur"
          width={28}
          height={28}
          className="h-7 w-7 flex-shrink-0"
        />
        <span className="font-extrabold text-sm md:text-base">
          {title}
        </span>
      </div>

      {/* Contenu principal avec padding */}
      <div className="p-6 md:p-8 flex flex-col items-center">
        {/* Icône croix + mascotte */}
        <div className="relative mb-6">
          {/* Croix en arrière-plan */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 opacity-20">
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
              className="h-[130px] w-[150px]"
              priority
            />
          </div>
        </div>

        {/* Titre principal */}
        <h2 className="text-xl md:text-2xl font-bold text-primary text-center mb-4 max-w-md">
          Vous pouvez toujours agir !
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-primary text-center mb-6 max-w-lg leading-relaxed">
          {description}
        </p>

        {/* Bouton d'action */}
        <Link href={finalHref}>
          <ActionButton
            icon={<Megaphone className="h-4 w-4" />}
            text={actionText}
            variant="default"
          />
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;