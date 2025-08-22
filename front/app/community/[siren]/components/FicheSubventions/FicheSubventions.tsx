import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import EmptyState from '#components/EmptyState';
import {
  SCORE_TO_ADJECTIF,
  SCORE_TRANSPARENCY_COLOR,
  TransparencyScore,
} from '#components/TransparencyScore/constants';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import { fetchSubventions } from '#utils/fetchers/subventions/fetchSubventions-server';
import { fetchSubventionsAvailableYears } from '#utils/fetchers/subventions/fetchSubventionsAvailableYears';
import { CommunityType } from '#utils/types';
import { FileText } from 'lucide-react';

import { FicheCard } from '../FicheCard';
import { SubventionsWithState } from './SubventionsWithState';

async function getFewSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({
    filters: { id_attribuant: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 10,
  });

  return subventionsResults;
}

const SubventionsHeader = ({
  transparencyIndex,
}: {
  transparencyIndex?: TransparencyScore | null;
}) => {
  return (
    <div className='flex min-h-[80px] flex-col items-center justify-between sm:flex-row sm:items-center'>
      <div className='order-2 flex items-center gap-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Subventions</h2>
      </div>
      {transparencyIndex && (
        <div className='order-1 mb-2 sm:order-2 sm:mb-0 md:mb-4'>
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

export async function FicheSubventions({
  siren,
  communityType,
}: {
  siren: string;
  communityType: CommunityType;
}) {
  const fewSubventions = await getFewSubventions(siren);
  const availableYears = await fetchSubventionsAvailableYears(siren);

  // Fetch transparency score for Subventions
  const { bareme } = await fetchMostRecentTransparencyScore(siren);
  const transparencyIndex = bareme?.subventions_score || null;

  return (
    <FicheCard header={<SubventionsHeader transparencyIndex={transparencyIndex} />}>
      {fewSubventions.length > 0 ? (
        <SubventionsWithState
          siren={siren}
          availableYears={availableYears}
          transparencyIndex={transparencyIndex}
          communityType={communityType}
        />
      ) : (
        <EmptyState
          title="Oups, il n'y a pas de données sur les subventions de cette collectivité !"
          description='Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les subventions publiques.'
          actionText='Interpeller'
          actionHref='/interpeller'
          siren={siren}
        />
      )}
    </FicheCard>
  );
}
