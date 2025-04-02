import { MarchePublic } from '@/app/models/marche_public';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Trends from './Trends';

type FicheMarchesPublics = {
  marchesPublics: MarchePublic[];
};

export function FicheMarchesPublics({ marchesPublics }: FicheMarchesPublics) {

  // // MarketType data
  // const marketType = Object.values(
  //   marchesPublics.reduce((acc, item) => {
  //     if (!acc[item.nature]) {
  //       acc[item.nature] = { name: item.nature, value: 0 };
  //     }
  //     acc[item.nature].value += 1;
  //     return acc;
  //   }, {}),
  // );

  // // MarketProcess data
  // const marketProcess = Object.values(
  //   marchesPublics.reduce((acc, item) => {
  //     if (!acc[item.procedure]) {
  //       acc[item.procedure] = { name: item.procedure, value: 0 };
  //     }
  //     acc[item.procedure].value += parseFloat(item.montant);
  //     return acc;
  //   }, {}),
  // );

  return (
    <div className='mx-auto my-6 max-w-screen-2xl rounded-xl border p-6 shadow'>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Évolution</TabsTrigger>
          <TabsTrigger value="distribution">Comparaison</TabsTrigger>
          <TabsTrigger value="details">Top 10</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <Trends  data={marchesPublics} />
        </TabsContent>
        <TabsContent value="distribution">
          <div className="bg-neutral-200 w-full h-[700px] flex items-center justify-center">A construire</div>
        </TabsContent>
        <TabsContent value="details">
          <div className="bg-neutral-200 w-full h-[700px]"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
