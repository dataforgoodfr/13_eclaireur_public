'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { downloadSubventionsByNafCSV } from '@/utils/fetchers/subventions/download/downloadSubventionsByNaf';
import { useDownloadChartSVG } from '@/utils/hooks/useDownloadChartSVG';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import SubventionsSectorTable from './SubventionsSectorTable';
import SubventionsSectorTreemap from './SubventionsSectorTreemap';

const CHART_TITLE = 'Répartition par secteur';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  const { ref: treemapRef, downloadChartSVG: downloadSVGTreemap } = useDownloadChartSVG({
    title: getDownloadedChartTitle(selectedYear),
  });

  function handleClickDownloadChart() {
    downloadSVGTreemap({ fileName: 'treemap-subventions-by-sector' });
  }
  function handleClickDownloadData() {
    downloadSubventionsByNafCSV(siren, selectedYear === 'All' ? null : selectedYear);
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
        <SubventionsSectorTable siren={siren} year={selectedYear} />
      ) : (
        <SubventionsSectorTreemap siren={siren} year={selectedYear} svgRef={treemapRef} />
      )}
    </>
  );
}

function getDownloadedChartTitle(year: YearOption) {
  if (year === 'All') return CHART_TITLE;

  return `${CHART_TITLE} - ${year}`;
}
