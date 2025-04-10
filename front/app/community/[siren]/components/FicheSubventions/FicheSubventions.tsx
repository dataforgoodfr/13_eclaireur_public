import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';
import { CommunityType } from '@/utils/types';

// import Top10 from './Top10';
// import Treemap from './Treemap';
import Trends from './Trends';

async function getSubventions(siren: string) {
  // Ville de Rodez 211202023
  // Ville de Lyon 200046977 
  // Ville de Bordeaux 243300316 
  const subventionsResults = await fetchSubventions({attribuant_siren : "211202023"});

  return subventionsResults;
}

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);
  console.log(subventions)
  console.log(siren)

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
            <Trends />
          </TabsContent>
          <TabsContent value='distribution'>
            <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
              En construction
            </div>
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
    </div>    </>
  )
}
