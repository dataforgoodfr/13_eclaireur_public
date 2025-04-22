import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';

import Distribution from './Distribution';
import Trends from './Trends';

async function getSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({
    filters: { attribuant_siren: siren },
    limit: 100,
  });

  return subventionsResults;
}

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);

  return (
    <>
      <div className='mx-auto my-6 max-w-screen-2xl rounded-xl border p-6 shadow'>
        <h2 className='pb-3 text-center text-2xl'>Subventions</h2>
        {subventions.length > 0 ? (
          <Tabs defaultValue='trends'>
            <TabsList>
              <TabsTrigger value='trends'>Évolution</TabsTrigger>
              <TabsTrigger value='distribution'>Répartition</TabsTrigger>
              <TabsTrigger value='compare'>Comparaison</TabsTrigger>
              <TabsTrigger value='details'>Classement</TabsTrigger>
            </TabsList>
            <TabsContent value='trends'>
              <Trends data={subventions} />
            </TabsContent>
            <TabsContent value='distribution'>
              <Distribution data={subventions} />
            </TabsContent>
            <TabsContent value='compare'>
              <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
                En construction
              </div>
            </TabsContent>
            <TabsContent value='details'>
              <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
                En construction
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <NoData />
        )}
      </div>{' '}
    </>
  );
}
