import { Community } from '@/app/models/community';
import { MarchePublic } from '@/app/models/marchePublic';
import { TransparencyScoreBar } from '@/components/TransparencyScore/TransparencyScore';
import { TransparencyScore } from '@/components/TransparencyScore/constants';
import SectionSeparator from '@/components/utils/SectionSeparator';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';

type MarchesPublicsComparisonProperties = {
  siren1: string;
  siren2: string;
};
export async function MarchesPublicsComparison({
  siren1,
  siren2,
}: MarchesPublicsComparisonProperties) {
  const marchesPublics1 = await fetchMarchesPublics({
    filters: { acheteur_id: siren1 },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });
  const marchesPublics2 = await fetchMarchesPublics({
    filters: { acheteur_id: siren2 },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });

  return (
    <>
      <SectionSeparator sectionTitle='Marchés publics (2024)' />
      <div className='flex justify-around'>
        <ComparingMarchesPublics data={marchesPublics1} />
        <ComparingMarchesPublics data={marchesPublics2} />
      </div>
    </>
  );
}

function ComparingMarchesPublics({ data }: { data: MarchePublic[] }) {
  return (
    <div className='flex-col text-center'>
      
    </div>
  );
}
