import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { SCORE_TO_ADJECTIF, SCORE_TRANSPARENCY_COLOR, TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import { fetchMarchesPublics } from '#utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears';
import { FileText } from 'lucide-react';
import { FicheCard } from '../FicheCard';
import { NoData } from '../NoData';
import { MarchesPublicsWithState } from './MarchesPublicsWithState';

async function getMarchesPublics(siren: string) {
  const marchesPublicsResults = await fetchMarchesPublics({
    filters: { acheteur_id: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 1,
  });

  return marchesPublicsResults;
}

const MarchesPublicsHeader = ({ transparencyIndex }: { transparencyIndex?: TransparencyScore | null }) => {
  return (
    <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2 order-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Marchés Publics</h2>
      </div>
      {transparencyIndex && (
        <div className="order-1 sm:order-2 md:mb-4 mb-2 sm:mb-0">
          <BadgeCommunity
            text={`Indice de transparence: ${transparencyIndex} - ${SCORE_TO_ADJECTIF[transparencyIndex]}`}
            icon={FileText}
            className={`${SCORE_TRANSPARENCY_COLOR[transparencyIndex]} text-primary`}
          />
        </div>
      )}
    </div>
  );
};

export async function FicheMarchesPublics({ siren }: { siren: string }) {
  const marchesPublics = await getMarchesPublics(siren);
  const availableYears = await fetchMarchesPublicsAvailableYears(siren)

  // Fetch transparency score for Marchés Publics
  const { bareme } = await fetchMostRecentTransparencyScore(siren);
  const transparencyIndex = bareme?.mp_score || null;
  return (
    <FicheCard header={<MarchesPublicsHeader transparencyIndex={transparencyIndex} />}>
      {marchesPublics.length > 0 ? (
        <MarchesPublicsWithState siren={siren} availableYears={availableYears} />
      ) : (
        <NoData />
      )}
    </FicheCard>
  );
}