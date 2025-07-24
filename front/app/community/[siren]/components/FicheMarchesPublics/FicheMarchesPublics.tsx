
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { fetchMarchesPublics } from '#utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '#utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears';
import { FicheCard } from '../FicheCard';
import { NoData } from '../NoData';
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
export async function FicheMarchesPublics({ siren }: { siren: string }) {
  const marchesPublics = await getMarchesPublics(siren);
  // const marchesPublics = [];
  const availableYears = await fetchMarchesPublicsAvailableYears(siren)
  // const availableYears = [2021, 2022, 2023];
  return (
    <FicheCard>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
      {marchesPublics.length > 0 ? (
        <Tabs defaultValue={tabs.trends}>
          <TabsList>
            <TabsTrigger value={tabs.trends}>Évolution</TabsTrigger>
            <TabsTrigger value={tabs.distribution}>Répartition</TabsTrigger>
            <TabsTrigger value={tabs.comparison}>Comparaison</TabsTrigger>
            <TabsTrigger value={tabs.details}>Contrats</TabsTrigger>
          </TabsList>
          <TabsContent value={tabs.trends}>
            <Evolution siren={siren} />
          </TabsContent>
          <TabsContent value={tabs.distribution}>
            <Distribution siren={siren} availableYears={availableYears} />
          </TabsContent>
          <TabsContent value={tabs.comparison}>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              En construction
            </div>
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
