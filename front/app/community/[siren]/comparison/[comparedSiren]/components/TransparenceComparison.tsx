import { Community } from '@/app/models/community';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import SectionSeparator from '@/components/utils/SectionSeparator';

type TransparenceComparisonProperties = {
  community1: Community;
  community2: Community;
};

export function TransparenceComparison({ community1, community2 }: TransparenceComparisonProperties) {
  return (
    <>
      <SectionSeparator sectionTitle='Scores de transparence (2024)' />
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
