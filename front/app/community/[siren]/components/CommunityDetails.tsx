impor type { Community } from '#app/models/community';
import { type } from 'os';
import { CircleX, FileText, Landmark, Layers, Users } from 'lucide-react';
import { from } from 'pg-copy-streams';
import { Community } from '#app/models/community.js';
import { formatNumberInteger, stringifyCommunityType } from '#utils/utils';

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
    <>

      {/* Info blocks */}
      <div className='flex flex-col gap-4 w-full'>
        <InfoBlock
          label='Population'
          value={`${formatNumberInteger(community.population)}`}
          bgColor='bg-yellow-100'
        />
        <InfoBlock
          label='Superficie en hectares'
          value={`${formatNumberInteger(community.superficie_ha || 0)}`}
          bgColor='bg-lime-100'
        />
        <InfoBlock
          label="Nombre d’agents administratifs"
          value={`${formatNumberInteger(community.tranche_effectif)} agents`}
          bgColor='bg-indigo-100'
        />
      </div>
    </>
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  bgColor?: string;
};

function InfoBlock({ label, value, bgColor = 'bg-gray-100' }: InfoBlockProps) {
  return (
    <div className={`rounded-none rounded-br-2xl rounded-tl-2xl p-4 text-primary ${bgColor}`}>
      <p className='text-sm md:text-base font-medium'>{label}</p>
      <p className='text-xl md:text-2xl font-bold'>{value}</p>
    </div>
  );
}
