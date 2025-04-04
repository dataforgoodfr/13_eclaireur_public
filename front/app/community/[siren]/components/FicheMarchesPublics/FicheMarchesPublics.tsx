import { MarchePublic } from '@/app/models/marche_public';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Top10 from './Top10';
import Trends from './Trends';

type FicheMarchesPublics = {
  marchesPublics: MarchePublic[];
};

export function FicheMarchesPublics({ marchesPublics }: FicheMarchesPublics) {
  return (
    <div className='mx-auto my-6 max-w-screen-2xl rounded-xl border p-6 shadow'>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
      <Tabs defaultValue='trends'>
        <TabsList>
          <TabsTrigger value='trends'>Évolution</TabsTrigger>
          <TabsTrigger value='distribution'>Répartition</TabsTrigger>
          <TabsTrigger value='compare'>Comparaison</TabsTrigger>
          <TabsTrigger value='details'>Classement</TabsTrigger>
        </TabsList>
        <TabsContent value='trends'>
          <Trends data={marchesPublics} />
        </TabsContent>
        <TabsContent value='distribution'>
          <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
            Treemap en construction
          </div>
        </TabsContent>
        <TabsContent value='compare'>
          <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
            En construction
          </div>
        </TabsContent>
        <TabsContent value='details'>
          <Top10 rawData={marchesPublics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
