import { NoData } from '@/app/community/[siren]/components/NoData';
import { MarchePublic } from '@/app/models/marche_public';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchMarchesPublics } from '@/utils/fetchers/marches-publics/fetchMarchesPublics-server';

import Top10 from './Top10';

const tabs = {
  trends: 'trends',
  distribution: 'distribution',
  comparison: 'comparison',
  details: 'details',
};

async function getMarchesPublics(siren: string) {
  const marchesPublicsResults = await fetchMarchesPublics({ filters: { acheteur_siren: siren } });

  return marchesPublicsResults;
}

type FicheMarchesPublics = {
  marchesPublics: MarchePublic[];
};

export async function FicheMarchesPublics({ siren }: { siren: string }) {
  const marchesPublics = await getMarchesPublics(siren);

  return (
    <div className='mx-auto my-6 max-w-screen-2xl rounded-xl border p-6 shadow'>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
      {[''].length > 0 ? (
        <Tabs defaultValue={tabs.trends}>
          <TabsList>
            <TabsTrigger value={tabs.trends}>Évolution</TabsTrigger>
            <TabsTrigger value={tabs.distribution}>Répartition</TabsTrigger>
            <TabsTrigger value={tabs.comparison}>Comparaison</TabsTrigger>
            <TabsTrigger value={tabs.details}>Classement</TabsTrigger>
          </TabsList>
          <TabsContent value={tabs.trends}>{/*   <Trends data={marchesPublics} /> */}</TabsContent>
          <TabsContent value={tabs.distribution}>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              Treemap en construction
            </div>
          </TabsContent>
          <TabsContent value={tabs.comparison}>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              En construction
            </div>
          </TabsContent>
          <TabsContent value={tabs.details}>
            <Top10 rawData={marchesPublics} />
          </TabsContent>
        </Tabs>
      ) : (
        <NoData />
      )}
    </div>
  );
}
