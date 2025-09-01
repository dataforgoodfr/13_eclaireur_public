'use client';

import { TransparencyScore } from '#components/TransparencyScore/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#components/ui/tabs';
import { TAB_VALUES, useSubventionsTab } from '#hooks/useTabState';
import { CommunityType } from '#utils/types';

import Comparison from './Comparison';
import Distribution from './Distribution';
import Evolution from './Evolution';
import Ranking from './Ranking';

interface SubventionsWithStateProps {
  siren: string;
  availableYears: number[];
  transparencyIndex?: TransparencyScore | null;
  communityType: CommunityType;
  communityName: string;
}

export function SubventionsWithState({
  siren,
  availableYears,
  communityType,
  communityName,
}: SubventionsWithStateProps) {
  const [activeTab, setActiveTab] = useSubventionsTab();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className='h-10 p-0.5 sm:h-12 sm:p-1'>
        <TabsTrigger
          value={TAB_VALUES.SUBVENTIONS.TRENDS}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Évolution
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.SUBVENTIONS.DISTRIBUTION}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Répartition
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.SUBVENTIONS.COMPARISON}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Comparaison
        </TabsTrigger>
        <TabsTrigger
          value={TAB_VALUES.SUBVENTIONS.DETAILS}
          className='px-2 text-xs sm:px-3 sm:text-sm'
        >
          Classement
        </TabsTrigger>
      </TabsList>

      <TabsContent value={TAB_VALUES.SUBVENTIONS.TRENDS}>
        <Evolution siren={siren} communityName={communityName} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.DISTRIBUTION}>
        <Distribution siren={siren} availableYears={availableYears} communityName={communityName} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.COMPARISON}>
        <Comparison siren={siren} communityType={communityType} />
      </TabsContent>
      <TabsContent value={TAB_VALUES.SUBVENTIONS.DETAILS}>
        <Ranking siren={siren} availableYears={availableYears} />
      </TabsContent>
    </Tabs>
  );
}
