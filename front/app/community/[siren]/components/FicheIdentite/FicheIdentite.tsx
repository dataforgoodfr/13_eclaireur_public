import { Community } from '@/app/models/community';
import { BadgeEuro, FileText, Landmark, Layers, Users } from 'lucide-react';

import { FicheCard } from '../FicheCard';
import NeighboursMap from '../NeighboursMap/NeighboursMap';

type FicheIdentiteProps = {
  community: Community;
};

const ficheTitle = `Fiche identité`;
const collectivitesLabel = 'Collectivités';
const populationLabel = 'Population';
const populationUnit = 'habitants';
const agentsLabel = "Nombre d'agents administratifs";
const agentsUnit = 'agents';
const totalBudgetLabel = 'Budget total';
const obligationPublicationText = `Soumise à l'obligation de publication`;

type TinyCard = {
  title: string;
  description?: string;
  icon: React.ReactNode;
};

function TinyCard({ title, description, icon }: TinyCard) {
  return (
    <div className='flex items-center gap-4'>
      {icon}
      <div>
        <p>{title}</p>
        {description && <p className='text-sm'>{description}</p>}
      </div>
    </div>
  );
}

export function FicheIdentite({ community }: FicheIdentiteProps) {
  // TODO - get and add the last update date
  const lastUpdateText = `Derniere mise a jour`;

  console.log(community);

  return (
    <FicheCard title={ficheTitle}>
      <div className='flex flex-col items-center justify-between gap-6 md:flex-row md:items-start'>
        <div className='flex flex-col gap-2'>
          <TinyCard title={collectivitesLabel} description={community.type} icon={<Layers />} />
          <TinyCard
            title={populationLabel}
            description={`${community.population.toLocaleString()} ${populationUnit}`}
            icon={<Users />}
          />
          <TinyCard title={agentsLabel} description={`TODO ${agentsUnit}`} icon={<Landmark />} />
          <TinyCard
            title={totalBudgetLabel}
            description={`${community.population.toLocaleString()} ${populationUnit}`}
            icon={<BadgeEuro />}
          />
          <TinyCard title={obligationPublicationText} icon={<FileText />} />
        </div>
        <NeighboursMap community={community} />
      </div>
    </FicheCard>
  );
}
