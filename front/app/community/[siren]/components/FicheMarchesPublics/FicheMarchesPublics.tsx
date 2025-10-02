import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import EmptyState from '#components/EmptyState';
import {
  SCORE_INDICE_COLOR,
  SCORE_TO_ADJECTIF,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import { fetchMarchesPublics } from '#utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears';
import { CommunityType } from '#utils/types';
import { FileText } from 'lucide-react';

import { FicheCard } from '../FicheCard';
import { MarchesPublicsWithState } from './MarchesPublicsWithState';

async function getMarchesPublics(siren: string) {
  const marchesPublicsResults = await fetchMarchesPublics({
    filters: { acheteur_id: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 1,
  });

  return marchesPublicsResults;
}

const MarchesPublicsHeader = ({
  transparencyIndex,
}: {
  transparencyIndex?: TransparencyScore | null;
}) => {
  return (
    <div className='flex min-h-[80px] flex-col sm:flex-row sm:items-center md:items-center md:justify-between'>
      <div className='order-2 flex items-center gap-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Marchés Publics</h2>
      </div>
      {transparencyIndex && (
        <div className='order-1 mb-2 sm:order-2 sm:mb-0'>
          <BadgeCommunity
            text={`Indice de transparence : ${transparencyIndex} - ${SCORE_TO_ADJECTIF[transparencyIndex]}`}
            icon={FileText}
            className={`${SCORE_INDICE_COLOR[transparencyIndex]} text-primary`}
          />
        </div>
      )}
    </div>
  );
};

export async function FicheMarchesPublics({
  siren,
  communityType,
  communityName,
}: {
  siren: string;
  communityType: CommunityType;
  communityName: string;
}) {
  const marchesPublics = await getMarchesPublics(siren);
  const availableYears = await fetchMarchesPublicsAvailableYears(siren);

  // Fetch transparency score for Marchés Publics
  const { bareme } = await fetchMostRecentTransparencyScore(siren);
  const transparencyIndex = bareme?.mp_score || null;

  console.log(bareme);

  return (
    <FicheCard header={<MarchesPublicsHeader transparencyIndex={transparencyIndex} />}>
      {marchesPublics.length > 0 ? (
        <MarchesPublicsWithState
          siren={siren}
          availableYears={availableYears}
          communityType={communityType}
          communityName={communityName}
        />
      ) : (
        <EmptyState
          title="Oups, il n'y a pas de données sur les marchés publics de cette collectivité !"
          description='Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les marchés publics.'
          actionText='Interpeller'
          actionHref='/interpeller'
          siren={siren}
        />
      )}
    </FicheCard>
  );
}
