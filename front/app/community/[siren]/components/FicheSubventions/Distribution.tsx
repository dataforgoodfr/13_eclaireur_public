'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { Subvention } from '@/app/models/subvention';
import { Switch } from '@/components/ui/switch';

import { TreeData, YearOption } from '../../types/interface';
import SectorTable from '../FicheMarchesPublics/SectorTable';
import Treemap from '../FicheMarchesPublics/Treemap';

function getAvailableYears(data: Subvention[]) {
  return [...new Set(data.map((item) => item.year))].sort((a: number, b: number) => a - b);
}

export default function Distribution({ data }: { data: Subvention[] }) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [tableDisplayed, setTableDisplayed] = useState(false);

  const availableYears: number[] = getAvailableYears(data);

  const filteredData =
    selectedYear === 'All' ? data : data.filter((item) => item.year === selectedYear);

  function getTopSectors(data: any[]) {
    const groupedData = data.reduce(
      (acc, { section_naf, montant }) => {
        if (section_naf === null) {
          return acc;
        }
        if (!acc[section_naf]) {
          acc[section_naf] = 0;
        }
        acc[section_naf] += parseFloat(String(montant));
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedGroupedData = Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => Number(b.value) - Number(a.value));

    const total = sortedGroupedData.reduce((acc, item) => acc + Number(item.value), 0);
    const top1 = Number(sortedGroupedData.slice(0, 1)[0].value);

    const sortedGroupedDataPlusTotal = sortedGroupedData.map((item) => ({
      ...item,
      part: Math.round((Number(item.value) / total) * 100 * 10) / 10,
      pourcentageCategoryTop1: Math.round((Number(item.value) / top1) * 100 * 10) / 10,
    }));

    const formattedData: TreeData = {
      type: 'node',
      name: 'boss',
      value: 0,
      children: sortedGroupedDataPlusTotal.map((item) => ({
        type: 'leaf',
        name: item.name,
        value: Number(item.value),
        part: item.part,
        pourcentageCategoryTop1: item.pourcentageCategoryTop1,
      })),
    };

    return formattedData;
  }

  const formattedData = getTopSectors(filteredData) as TreeData;

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Répartition </h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => {
                setTableDisplayed(false);
              }}
              className={`cursor-pointer ${!tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (graphique
            </div>{' '}
            <Switch
              checked={tableDisplayed}
              onCheckedChange={() => {
                setTableDisplayed((prev) => !prev);
              }}
            />
            <div
              onClick={() => {
                setTableDisplayed(true);
              }}
              className={`cursor-pointer ${tableDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              tableau)
            </div>{' '}
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      {tableDisplayed && <SectorTable data={formattedData} />}
      {!tableDisplayed && <Treemap data={formattedData} />}
    </>
  );
}
