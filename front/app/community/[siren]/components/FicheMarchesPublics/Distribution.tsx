'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { downloadMarchesPublicsByCPV2CSV } from '@/utils/fetchers/marches-publics/download/downloadMarchesPublicsByCPV2';
import { useDownloadChartSVG } from '@/utils/hooks/useDownloadChartSVG';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

const CHART_TITLE = 'Répartition par secteur';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  const { ref: treemapRef, downloadChartSVG: downloadSVGTreemap } = useDownloadChartSVG({
    title: getDownloadedChartTitle(selectedYear),
  });

  function handleClickDownloadData() {
    downloadMarchesPublicsByCPV2CSV(siren, selectedYear === 'All' ? null : selectedYear);
  }
  function handleClickDownloadChart() {
    downloadSVGTreemap({ fileName: 'treemap-marches-publics-by-sector' });
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>{CHART_TITLE}</h3>
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='graphique'
            label2='tableau'
          />
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector
            onClickDownloadData={handleClickDownloadData}
            onClickDownloadChart={isTableDisplayed ? undefined : handleClickDownloadChart}
          />
        </div>
      </div>
      {isTableDisplayed ? (
        <MarchesPublicsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <MarchesPublicsSectorTreemap siren={siren} year={selectedYear} svgRef={treemapRef} />
      )}
    </>
  );
}

function getDownloadedChartTitle(year: YearOption) {
  if (year === 'All') return CHART_TITLE;

  return `${CHART_TITLE} - ${year}`;
}
