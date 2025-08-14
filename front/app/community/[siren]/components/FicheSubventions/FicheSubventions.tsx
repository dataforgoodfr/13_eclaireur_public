import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { fetchSubventions } from '#utils/fetchers/subventions/fetchSubventions-server';
import { fetchSubventionsAvailableYears } from '#utils/fetchers/subventions/fetchSubventionsAvailableYears';

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

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);
  const availableYears = await fetchSubventionsAvailableYears(siren);

  return (
    <FicheCard>
      <h2 className='pb-3 text-center text-2xl'>Subventions</h2>
      {subventions.length > 0 ? (
        <Tabs defaultValue='trends'>
          <TabsList className='h-10 sm:h-12 p-0.5 sm:p-1'>
            <TabsTrigger value='trends' className='px-2 sm:px-3 text-xs sm:text-sm'>Évolution</TabsTrigger>
            <TabsTrigger value='distribution' className='px-2 sm:px-3 text-xs sm:text-sm'>Répartition</TabsTrigger>
            <TabsTrigger value='compare' className='px-2 sm:px-3 text-xs sm:text-sm'>Comparaison</TabsTrigger>
            <TabsTrigger value='details' className='px-2 sm:px-3 text-xs sm:text-sm'>Classement</TabsTrigger>
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
