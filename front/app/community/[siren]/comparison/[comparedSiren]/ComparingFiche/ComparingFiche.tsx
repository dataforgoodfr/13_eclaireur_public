import { Community } from '@/app/models/community';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { CommunityType } from '@/utils/types';
import { formatNumberInteger, stringifyCommunityType } from '@/utils/utils';

type ComparingFicheProps = {
  community1: Community;
  community2: Community;
};

export function ComparingFiche({ community1, community2 }: ComparingFicheProps) {
  console.log(community1);

  return (
    <>
      <div className='flex justify-around'>
        <ComparingHeader
          nom={community1.nom}
          communityType={community1.type}
          population={community1.population}
        />
        <ComparingHeader
          nom={community2.nom}
          communityType={community2.type}
          population={community2.population}
        />
      </div>

      <TitleHeadSection sectionTitle='Scores de transparence' />
      <div className='flex justify-around'>
        <ComparingScore
          score_mp={community1.mp_score}
          score_subvention={community1.subventions_score}
        />
        <ComparingScore
          score_mp={community2.mp_score}
          score_subvention={community2.subventions_score}
        />
      </div>
      
      <TitleHeadSection sectionTitle='Statistiques publiques' />
      <div className='flex justify-around'>
        <ComparingPublicStats
          agentNumber={community1.tranche_effectif}
          shouldPublish={community1.should_publish}
        />
        <ComparingPublicStats
          agentNumber={community2.tranche_effectif}
          shouldPublish={community2.should_publish}
        />
      </div>
    </>
  );
}

type ComparingScoreProperties = {
  score_subvention: TransparencyScore | null;
  score_mp: TransparencyScore | null;
};

function ComparingScore({ score_subvention, score_mp }: ComparingScoreProperties) {
  return (
    <div className='flex-col text-center'>
      <p>Transparence des subventions</p>
      <TransparencyScoreBar score={score_subvention} />
      <p>Transparence des marchés publics</p>
      <TransparencyScoreBar score={score_mp} />
    </div>
  );
}

type ComparingHeaderProperties = {
  nom: string;
  communityType: CommunityType;
  population: number;
};

function ComparingHeader({ nom, communityType: type, population }: ComparingHeaderProperties) {
  return (
    <div className='flex-col text-center'>
      <p className='mb-2 text-xl font-bold'>{nom}</p>
      <p>{stringifyCommunityType(type)}</p>
      <p>{formatNumberInteger(population)} habitants</p>
    </div>
  );
}

type ComparingPublicStatsProperties = {
  agentNumber: number;
  shouldPublish: boolean;
};

function ComparingPublicStats({ agentNumber, shouldPublish }: ComparingPublicStatsProperties) {
  return (
    <div className='flex-col space-y-2 text-center'>
      <p>{formatNumberInteger(agentNumber)} agents administratifs</p>
      <p>{shouldPublish ? 'Soumise' : 'Non soumise'} à l'obligation de publication</p>
    </div>
  );
}

type TitleHeadSectionProperties = {
  sectionTitle: string;
};

function TitleHeadSection({ sectionTitle }: TitleHeadSectionProperties) {
  return (
    <div className='flex w-full items-center rounded-full'>
      <div className='flex-1 border-b border-gray-300'></div>
      <span className='px-8 py-3 text-lg font-semibold leading-8'>{sectionTitle}</span>
      <div className='flex-1 border-b border-gray-300'></div>
    </div>
  );
}
