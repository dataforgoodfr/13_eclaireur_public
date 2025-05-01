'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { useDownloadSVG } from '@/utils/hooks/useDownloadSVG';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

type DistributionProps = { siren: string; availableYears: number[] };

export default function Distribution({ siren, availableYears }: DistributionProps) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  const { ref: treemapRef, downloadSVG: downloadSVGTreemap } = useDownloadSVG();

  function handleDownloadChart() {
    downloadSVGTreemap({ fileName: 'treemap-marches-publics-by-sector' });
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition par secteur</h3>
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='graphique'
            label2='tableau'
          />
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector onDownloadChart={isTableDisplayed ? undefined : handleDownloadChart} />
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
