'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { useMarchesPublicsTab, TAB_VALUES } from '#hooks/useTabState';

import Comparison from './Comparison';
import Contracts from './Contracts';
import Distribution from './Distribution';
import Evolution from './Evolution';

interface MarchesPublicsWithStateProps {
  siren: string;
  availableYears: number[];
}

export function MarchesPublicsWithState({ siren, availableYears }: MarchesPublicsWithStateProps) {
  const [activeTab, setActiveTab] = useMarchesPublicsTab();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className='h-10 sm:h-12 p-0.5 sm:p-1'>
        <TabsTrigger value={TAB_VALUES.MARCHES_PUBLICS.TRENDS} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Évolution
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.MARCHES_PUBLICS.DISTRIBUTION} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Répartition
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.MARCHES_PUBLICS.COMPARISON} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Comparaison
        </TabsTrigger>
        <TabsTrigger value={TAB_VALUES.MARCHES_PUBLICS.DETAILS} className='px-2 sm:px-3 text-xs sm:text-sm'>
          Contrats
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={TAB_VALUES.MARCHES_PUBLICS.TRENDS}>
        <Evolution siren={siren} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.MARCHES_PUBLICS.DISTRIBUTION}>
        <Distribution siren={siren} availableYears={availableYears} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.MARCHES_PUBLICS.COMPARISON}>
        <Comparison siren={siren} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.MARCHES_PUBLICS.DETAILS}>
        <Contracts siren={siren} availableYears={availableYears} />
      </TabsContent>
    </Tabs>
  );
}