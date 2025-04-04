import { Community } from '@/app/models/community';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { BadgeEuro, FileText, Landmark, Layers, Users } from 'lucide-react';

import { FicheCard } from '../FicheCard';
import { TransparencyScores } from '../TransparencyScores/TransparencyScores';

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
  // TODO - retrieve scores
  const scores = { subventions: TransparencyScore.E, marchesPublics: TransparencyScore.B };
  const trends = { subventions: 1, marchesPublics: 0.01 };

  return (
    <FicheCard title={ficheTitle}>
      <div className='mb-10 flex flex-col items-center justify-between gap-6 md:flex-row md:items-start'>
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
        {/** TODO - Add back when lat/long are added in data */}
        {/* <NeighboursMap community={community} /> */}
      </div>
      <TransparencyScores scores={scores} trends={trends} />
    </FicheCard>
  );
}
