'use client';

import { useRef, useState } from 'react';

import DownloadSelector from '#app/community/[siren]/components/DownloadDropDown';
import YearSelector from '#app/community/[siren]/components/YearSelector';
import downloadSVG from '#utils/downloader/downloadSVGChart';
import { downloadMarchesPublicsByCPV2CSV } from '#utils/fetchers/marches-publics/download/downloadMarchesPublicsByCPV2';

import { YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import { TabHeader } from '../TabHeader';
import MarchesPublicsSectorTable from './MarchesPublicsSectorTable';
import MarchesPublicsSectorTreemap from './MarchesPublicsSectorTreeMap';

type DistributionProps = { siren: string; availableYears: number[]; communityName: string };

export default function Distribution({ siren, availableYears, communityName }: DistributionProps) {
  const marchesPublicsSectorTreemapRef = useRef<SVGSVGElement | null>(null);

  const defaultYear: YearOption = availableYears.length > 0 ? Math.max(...availableYears) : 'All';
  const [selectedYear, setSelectedYear] = useState<YearOption>(defaultYear);
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  function handleDownloadData() {
    downloadMarchesPublicsByCPV2CSV(siren, selectedYear === 'All' ? null : selectedYear);
  }

  function handleDownloadChart() {
    downloadSVG(marchesPublicsSectorTreemapRef.current, {
      communityName,
      chartTitle: 'Répartition par secteur',
    });
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
            <DownloadSelector
              onClickDownloadData={handleDownloadData}
              onClickDownloadChart={handleDownloadChart}
              disabled={selectedYear === 'All'}
            />
          </>
        }
      />
      <div style={{ display: isTableDisplayed ? 'block' : 'none' }}>
        <MarchesPublicsSectorTable siren={siren} year={selectedYear} />
      </div>
      <div style={{ display: !isTableDisplayed ? 'block' : 'none' }}>
        <MarchesPublicsSectorTreemap
          ref={marchesPublicsSectorTreemapRef}
          siren={siren}
          year={selectedYear}
        />
      </div>
    </>
  );
}
