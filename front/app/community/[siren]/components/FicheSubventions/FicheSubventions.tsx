import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';

// import Top10 from './Top10';
// import Treemap from './Treemap';
// import Trends from './Trends';

async function getSubventions(siren: string) {
  const subventionsResults = await fetchSubventions({ attribuant_siren: siren });

  return subventionsResults;
}

export async function FicheSubventions({ siren }: { siren: string }) {
  const subventions = await getSubventions(siren);
  console.log(subventions)

  return (
    <>
      {/* {subventions.length === 0 && <NoData />} */}
    </>
  )
}
