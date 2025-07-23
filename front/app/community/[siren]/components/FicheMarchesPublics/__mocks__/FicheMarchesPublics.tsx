import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FicheCard } from '../../FicheCard';


export function FicheMarchesPublics({ siren }: { siren: string }) {
  console.log('Mock FicheMarchesPublics component loaded');
  if (siren === 'nodata') {
    return (
      <FicheCard>
        <h2 className='pb-3 text-center text-2xl'>Marchés Publics</h2>
        <NoData />
      </FicheCard>
    );
  }

  return (
    <FicheCard>
      <h2 className='pb-3 text-center text-2xl'>Marchés Publics (Mocked)</h2>
      <Tabs defaultValue='trends'>
        <TabsList>
          <TabsTrigger value='trends'>Évolution</TabsTrigger>
          <TabsTrigger value='distribution'>Répartition</TabsTrigger>
          <TabsTrigger value='comparison'>Comparaison</TabsTrigger>
          <TabsTrigger value='details'>Contrats</TabsTrigger>
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
          <div className='p-4'>Mocked Contracts Content for {siren}</div>
        </TabsContent>
      </Tabs>
    </FicheCard>
  );
}
