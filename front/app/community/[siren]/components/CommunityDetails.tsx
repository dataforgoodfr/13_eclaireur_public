import { Community } from '#app/models/community';
import { formatNumberInteger, stringifyCommunityType } from '#utils/utils';
import { CircleX, FileText, Landmark, Layers, Users } from 'lucide-react';

const collectivitesLabel = 'Collectivités';
const populationLabel = 'Population';
const populationUnit = 'habitants';
const agentsLabel = "Nombre d'agents administratifs";
const agentsUnit = 'agents';
// const totalBudgetLabel = 'Budget total';
const obligationPublicationText = `Soumise à l'obligation de publication`;
const pasObligationPublicationText = `Non soumise à l'obligation de publication`;

type CommunityDetailsProps = {
  community: Community;
};

export function CommunityDetails({ community }: CommunityDetailsProps) {
  return (
    <div className='flex flex-col gap-2'>
      <TinyCard
        title={collectivitesLabel}
        description={stringifyCommunityType(community.type)}
        icon={<Layers />}
      />
      <TinyCard
        title={populationLabel}
        description={`${formatNumberInteger(community.population)} ${populationUnit}`}
        icon={<Users />}
      />
      <TinyCard
        title={agentsLabel}
        description={`${formatNumberInteger(community.tranche_effectif)}  ${agentsUnit}`}
        icon={<Landmark />}
      />
      {/** TODO - Add back when budget is in community in db */}
      {/* <TinyCard
        title={totalBudgetLabel}
        description={formatCompactPrice(community.budget)}
        icon={<BadgeEuro />}
      /> */}
      {community.should_publish ? (
        <TinyCard title={obligationPublicationText} icon={<FileText />} />
      ) : (
        <TinyCard title={pasObligationPublicationText} icon={<CircleX />} />
      )}
    </div>
  );
}

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
