'use client';

import { useState } from 'react';

import DownloadSelector from '#app/community/[siren]/components/DownloadDropDown';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import { downloadMarchesPublicsByCPV2CSV } from '#utils/fetchers/marches-publics/download/downloadMarchesPublicsByCPV2';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import { TabHeader } from '../TabHeader';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleDownloadData() {
    downloadMarchesPublicsByCPV2CSV(siren, selectedYear === 'All' ? null : selectedYear);
  }

  return (
    <>
      <TabHeader
        title='Répartition par secteur'
        titleSwitch={
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='Graphique'
            label2='Tableau'
          />
        }
        actions={
          <>
            <YearSelector defaultValue={defaultYear} onSelect={setSelectedYear} />
            <DownloadSelector onClickDownloadData={handleDownloadData} />
          </>
        }
      />
      {isTableDisplayed ? (
        <MarchesPublicsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <MarchesPublicsSectorTreemap siren={siren} year={selectedYear} />
      )}
    </>
  );
}
