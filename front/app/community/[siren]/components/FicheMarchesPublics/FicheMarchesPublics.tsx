import { MarchePublic } from '@/app/models/marche_public';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GraphModel from './GraphModel';
import Trends from './Trends';

type FicheMarchesPublics = {
  marchesPublics: MarchePublic[];
};

export function FicheMarchesPublics({ marchesPublics }: FicheMarchesPublics) {

  // Marches publics
  // console.log(marchesPublics)

  // Trends
  // type formattedDataTrends = {
  //   Année: number;
  //   Montant: number;
  //   Nombre: number;
  // };

  // const trends: formattedDataTrends[] = Object.values(
  //   marchesPublics.reduce<Record<string, formattedDataTrends>>((acc, item) => {
  //     const year = item.datenotification_annee;

  //     if (!acc[year]) {
  //       acc[year] = { Année: year, Montant: 0, Nombre: 0 };
  //     }
  //     acc[year].Montant += parseFloat(item.montant) || 0;
  //     acc[year].Nombre += 1;

  //     return acc;
  //   }, {}),
  // );

  // // MarketByActivities data
  // const totalByCategory = Object.values(
  //   marchesPublics.reduce((acc, item) => {
  //     if (!acc[item.cpv_2_label]) {
  //       acc[item.cpv_2_label] = { name: item.cpv_2_label, size: 0 };
  //     }
  //     acc[item.cpv_2_label].size += parseFloat(item.montant);
  //     return acc;
  //   }, {}),
  // );

  // type TreeNode = {
  //   type: 'node' | 'leaf';
  //   name: string;
  //   value: number;
  //   children?: TreeNode[];
  // };

  // const dataForTreemap: TreeNode = {
  //   type: 'node',
  //   name: 'boss',
  //   value: 0,
  //   children: totalByCategory.map((item) => ({
  //     type: 'leaf',
  //     name: item.name,
  //     value: item.size,
  //   })),
  // };

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
          <TabsTrigger value="distribution">Répartition</TabsTrigger>
          <TabsTrigger value="details">En détail</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <GraphModel 
            title="Évolution des marchés publics au cours du temps" 
            children={
            <Trends  data={marchesPublics} />
            }
          />
        </TabsContent>
        <TabsContent value="distribution">
          {/* <MarchesPublicsByActivities data={TreemapData}/> */}
          <div className="bg-neutral-300 w-full h-[700px]"></div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {/* <MarketType data={MarketTypeData}/>
            <MarketProcess data={MarketProcessData}/> */}
          </div>
        </TabsContent>
        <TabsContent value="details">
          <div className="bg-neutral-200 w-full h-[700px]"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
