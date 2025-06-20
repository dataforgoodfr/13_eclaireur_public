import { Community } from '@/app/models/community';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import SectionSeparator from '@/components/utils/SectionSeparator';
import { formatNumberInteger } from '@/utils/utils';

type GlobalStatsComparisonProperties = {
  community1: Community;
  community2: Community;
};

export function GlobalStatsComparison({ community1, community2 }: GlobalStatsComparisonProperties) {
  return (
    <>
      <SectionSeparator sectionTitle='Statistiques générales' />
      <div className='flex justify-around'>
        <ComparingGlobalStats
          agentNumber={community1.tranche_effectif}
          shouldPublish={community1.should_publish}
        />
        <ComparingGlobalStats
          agentNumber={community2.tranche_effectif}
          shouldPublish={community2.should_publish}
        />
      </div>
    </>
  );
}

type ComparingGlobalStatsProperties = {
  agentNumber: number;
  shouldPublish: boolean;
};

function ComparingGlobalStats({ agentNumber, shouldPublish }: ComparingGlobalStatsProperties) {
  return (
    <div className='flex-col space-y-2 text-center'>
      <p>{formatNumberInteger(agentNumber)} agents administratifs</p>
      <p>{shouldPublish ? 'Soumise' : 'Non soumise'} à l'obligation de publication</p>
    </div>
  );
}
