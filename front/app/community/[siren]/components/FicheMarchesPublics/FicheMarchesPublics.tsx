import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';

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
  const test = await fetchMarchesPublics({
    filters: { acheteur_siren: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
    orderBy: { direction: 'asc', column: 'montant' },
  });

  return (
    <div className='mx-auto my-6 max-w-screen-2xl rounded-xl border p-6 shadow'>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
      {[''].length > 0 ? (
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
            <Distribution data={marchesPublics} />
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
    </div>
  );
}
