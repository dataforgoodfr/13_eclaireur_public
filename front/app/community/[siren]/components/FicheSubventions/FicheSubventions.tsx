import { NoData } from '@/app/community/[siren]/components/NoData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchSubventions } from '@/utils/fetchers/subventions/fetchSubventions-server';

// import Top10 from './Top10';
// import Treemap from './Treemap';
// import Trends from './Trends';

async function getSubventions(siren: string) {
  const marchesPublicsResults = await fetchSubventions({ attribuant_siren: siren });

  return marchesPublicsResults;
}

export async function FicheSubventions({ siren }: { siren: string }) {
  const marchesPublics = await getSubventions(siren);
  console.log(marchesPublics)

  return (
    <div>
      Hello World
    </div>
  )
}
