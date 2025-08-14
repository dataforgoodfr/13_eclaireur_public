
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';

import BadgeCommunity from '#components/Communities/BadgeCommunityPage';
import { SCORE_TO_ADJECTIF, SCORE_TRANSPARENCY_COLOR, TransparencyScore } from '#components/TransparencyScore/constants';
import { fetchMostRecentTransparencyScore } from '#utils/fetchers/communities/fetchTransparencyScore-server';
import { fetchMarchesPublics } from '#utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears';
import { FileText } from 'lucide-react';
import { FicheCard } from '../FicheCard';
import { NoData } from '../NoData';
import Comparison from './Comparison';
import Contracts from './Contracts';
import Distribution from './Distribution';
import Evolution from './Evolution';

const tabs = {
  trends: 'trends',
  distribution: 'distribution',
  comparison: 'comparison',
  details: 'details',
};

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
  // const marchesPublics = [];
  const availableYears = await fetchMarchesPublicsAvailableYears(siren)
  // const availableYears = [2021, 2022, 2023];

  // Fetch transparency score for Marchés Publics
  const { bareme } = await fetchMostRecentTransparencyScore(siren);
  const transparencyIndex = bareme?.mp_score || null;
  return (
    <FicheCard header={<MarchesPublicsHeader transparencyIndex={transparencyIndex} />}>
      {marchesPublics.length > 0 ? (
        <Tabs defaultValue={tabs.trends}>
          <TabsList>
            <TabsTrigger value={tabs.trends}>Évolution</TabsTrigger>
            <TabsTrigger value={tabs.distribution}>Répartition</TabsTrigger>
            <TabsTrigger value={tabs.comparison}>Comparaison</TabsTrigger>
            <TabsTrigger value={tabs.details}>Contrats</TabsTrigger>
          </TabsList>
          <TabsContent value={tabs.trends}>
            <Evolution siren={siren} transparencyIndex={transparencyIndex} />
          </TabsContent>
          <TabsContent value={tabs.distribution}>
            <Distribution siren={siren} availableYears={availableYears} />
          </TabsContent>
          <TabsContent value={tabs.comparison}>
            <Comparison siren={siren} />
          </TabsContent>
          <TabsContent value={tabs.details}>
            <Contracts siren={siren} availableYears={availableYears} />
          </TabsContent>
        </Tabs>
      ) : (
        <NoData />
      )}
    </FicheCard>
  );
}
