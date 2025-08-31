import EmptyState from '#components/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';

import { FicheCard } from '../FicheCard';

export async function FicheSubventions({ siren }: { siren: string }) {
  if (siren === 'nodata') {
    return (
      <FicheCard>
        <h2 className='pb-3 text-center text-2xl'>Subventions</h2>
        <EmptyState
          title='Aucune donnée de subventions disponible'
          description="Il n'y a pas de données de subventions disponibles. Tu peux utiliser la plateforme pour interpeller directement les élus ou les services concernés."
          siren={siren}
          className='h-[450px] w-full'
        />
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
