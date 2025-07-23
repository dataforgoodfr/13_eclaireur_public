import React from 'react';
import { FicheCard } from '../FicheCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NoData } from '@/app/community/[siren]/components/NoData';

export async function FicheSubventions({ siren }: { siren: string }) {
  if (siren === 'nodata') {
    return (
      <FicheCard>
        <h2 className='pb-3 text-center text-2xl'>Subventions</h2>
        <NoData />
      </FicheCard>
    );
  }

  return (
    <FicheCard>
      <h2 className='pb-3 text-center text-2xl'>Subventions (Mocked)</h2>
      <Tabs defaultValue='trends'>
        <TabsList>
          <TabsTrigger value='trends'>Évolution</TabsTrigger>
          <TabsTrigger value='distribution'>Répartition</TabsTrigger>
          <TabsTrigger value='comparison'>Comparaison</TabsTrigger>
          <TabsTrigger value='details'>Détails</TabsTrigger>
        </TabsList>
        <TabsContent value='trends'>
          <div className='p-4'>Mocked Evolution Content for {siren}</div>
        </TabsContent>
        <TabsContent value='distribution'>
          <div className='p-4'>Mocked Distribution Content for {siren}</div>
        </TabsContent>
        <TabsContent value='comparison'>
          <div className='p-4'>Mocked Comparison Content for {siren}</div>
        </TabsContent>
        <TabsContent value='details'>
          <div className='p-4'>Mocked Details Content for {siren}</div>
        </TabsContent>
      </Tabs>
    </FicheCard>
  );
}
