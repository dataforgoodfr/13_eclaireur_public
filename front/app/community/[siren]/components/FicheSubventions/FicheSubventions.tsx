import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { SCORE_TO_ADJECTIF, SCORE_TRANSPARENCY_COLOR, TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import { fetchSubventions } from '#utils/fetchers/subventions/fetchSubventions-server';
import { fetchSubventionsAvailableYears } from '#utils/fetchers/subventions/fetchSubventionsAvailableYears';
import { CommunityType } from '#utils/types';
import { FileText } from 'lucide-react';

import { FicheCard } from '../FicheCard';
import EmptyState from '#components/EmptyState';
import { SubventionsWithState } from './SubventionsWithState';

async function getSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({
    filters: { id_attribuant: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });

  return subventionsResults;
}

const SubventionsHeader = ({ transparencyIndex }: { transparencyIndex?: TransparencyScore | null }) => {
  return (
    <div className='flex flex-col items-center justify-between sm:flex-row sm:items-center min-h-[80px]'>
      <div className='flex items-center gap-2 order-2 sm:order-1'>
        <h2 className='text-3xl font-extrabold text-primary md:text-4xl'>Subventions</h2>
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

export async function FicheSubventions({ siren, communityType }: { siren: string; communityType: CommunityType }) {
  const subventions = await getSubventions(siren);
  const availableYears = await fetchSubventionsAvailableYears(siren);

  // Fetch transparency score for Subventions
  const { bareme } = await fetchMostRecentTransparencyScore(siren);
  const transparencyIndex = bareme?.subventions_score || null;

  return (
    <FicheCard header={<SubventionsHeader transparencyIndex={transparencyIndex} />}>
      {subventions.length > 0 ? (
        <SubventionsWithState siren={siren} subventions={subventions} availableYears={availableYears} transparencyIndex={transparencyIndex} communityType={communityType} />
      ) : (
        <EmptyState
          title="Oups, il n'y a pas de données sur les subventions de cette collectivité !"
          description="Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés, et les inciter à mettre à jour les données sur les subventions publiques."
          actionText="Interpeller"
          actionHref="/interpeller"
          siren={siren}
        />
      )}
    </FicheCard>
  );
}