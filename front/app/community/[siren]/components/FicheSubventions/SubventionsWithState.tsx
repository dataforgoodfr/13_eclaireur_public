'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { useSubventionsTab, TAB_VALUES } from '#hooks/useTabState';
import { Subvention } from '#app/models/subvention';

import Distribution from './Distribution';
import Evolution from './Evolution';
import Ranking from './Ranking';

interface SubventionsWithStateProps {
  siren: string;
  subventions: Subvention[];
  availableYears: number[];
}

export function SubventionsWithState({ siren, subventions, availableYears }: SubventionsWithStateProps) {
  const [activeTab, setActiveTab] = useSubventionsTab();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className='h-10 sm:h-12 p-0.5 sm:p-1'>
        <TabsTrigger value={TAB_VALUES.SUBVENTIONS.TRENDS} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Évolution
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.SUBVENTIONS.DISTRIBUTION} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Répartition
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.SUBVENTIONS.COMPARISON} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Comparaison
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.SUBVENTIONS.DETAILS} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Classement
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={TAB_VALUES.SUBVENTIONS.TRENDS}>
        <Evolution siren={siren} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.DISTRIBUTION}>
        <Distribution siren={siren} availableYears={availableYears} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.COMPARISON}>
        <div className='flex h-[600px] w-full items-center justify-center bg-neutral-200'>
          En construction
        </div>
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.DETAILS}>
        <Ranking data={subventions} availableYears={availableYears} />
      </TabsContent>
    </Tabs>
  );
}