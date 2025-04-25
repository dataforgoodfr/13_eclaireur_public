import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';
import { fetchMarchesPublicsAvailableYears } from '@/utils/fetchers/marches-publics/fetchMarchesPublicsAvailableYears';

import { FicheCard } from '../FicheCard';
import Contract from './Contract';
import Distribution from './Distribution';
import Trends from './Trends';

const tabs = {
  trends: 'trends',
  distribution: 'distribution',
  comparison: 'comparison',
  details: 'details',
};

async function getMarchesPublics(siren: string) {
  const marchesPublicsResults = await fetchMarchesPublics({
    filters: { acheteur_siren: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });

  return marchesPublicsResults;
}

export async function FicheMarchesPublics({ siren }: { siren: string }) {
  const marchesPublics = await getMarchesPublics(siren);
  const availableYears = await fetchMarchesPublicsAvailableYears(siren);

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
            <Trends data={marchesPublics} />
          </TabsContent>
          <TabsContent value={tabs.distribution}>
            <Distribution availableYears={availableYears} siren={siren} />
          </TabsContent>
          <TabsContent value={tabs.comparison}>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              En construction
            </div>
          </TabsContent>
          <TabsContent value={tabs.details}>
            <Contract data={marchesPublics} />
          </TabsContent>
        </Tabs>
      ) : (
        <NoData />
      )}
    </FicheCard>
  );
}
