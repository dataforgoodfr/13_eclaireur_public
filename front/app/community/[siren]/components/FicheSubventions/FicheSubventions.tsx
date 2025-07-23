import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';
import { fetchSubventionsAvailableYears } from '@/utils/fetchers/subventions/fetchSubventionsAvailableYears';

import { FicheCard } from '../FicheCard';
import { NoData } from '../NoData';
import Distribution from './Distribution';
import Evolution from './Evolution';
import Ranking from './Ranking';

async function getSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({
    filters: { id_attribuant: siren },
    // TODO - Remove limit when api to calculate data is done
    limit: 100,
  });

  return subventionsResults;
}

type FicheSubventionsProps = { siren: string };

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);
  const availableYears = await fetchSubventionsAvailableYears(siren);

  return (
    <FicheCard>
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
            <Evolution siren={siren} />
          </TabsContent>
          <TabsContent value='distribution'>
            <Distribution siren={siren} availableYears={availableYears} />
          </TabsContent>
          <TabsContent value='compare'>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              En construction
            </div>
          </TabsContent>
          <TabsContent value='details'>
            <Ranking data={subventions} availableYears={availableYears} />
          </TabsContent>
        </Tabs>
      ) : (
        <NoData />
      )}
    </FicheCard>
  );
}
