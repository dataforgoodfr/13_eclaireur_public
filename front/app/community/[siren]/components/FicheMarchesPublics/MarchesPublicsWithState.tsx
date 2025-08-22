'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { TAB_VALUES, useMarchesPublicsTab } from '#hooks/useTabState';
import { CommunityType } from '#utils/types';

import Comparison from './Comparison';
import Contracts from './Contracts';
import Distribution from './Distribution';
import Evolution from './Evolution';

interface MarchesPublicsWithStateProps {
  siren: string;
  availableYears: number[];
  communityType: CommunityType;
}

export function MarchesPublicsWithState({
  siren,
  availableYears,
  communityType,
}: MarchesPublicsWithStateProps) {
  const [activeTab, setActiveTab] = useMarchesPublicsTab();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className='h-10 p-0.5 sm:h-12 sm:p-1'>
        <TabsTrigger
          value={TAB_VALUES.MARCHES_PUBLICS.TRENDS}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Évolution
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.MARCHES_PUBLICS.DISTRIBUTION}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Répartition
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.MARCHES_PUBLICS.COMPARISON}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Comparaison
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.MARCHES_PUBLICS.DETAILS}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
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
        <Comparison siren={siren} communityType={communityType} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.MARCHES_PUBLICS.DETAILS}>
        <Contracts siren={siren} availableYears={availableYears} />
      </TabsContent>
    </Tabs>
  );
}
