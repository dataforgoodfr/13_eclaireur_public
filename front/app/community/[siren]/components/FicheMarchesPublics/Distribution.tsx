'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { MarchePublic } from '@/app/models/marchePublic';

import { TreeData, YearOption } from '../../types/interface';
import { GraphSwitch } from '../DataViz/GraphSwitch';
import SectorTable from './SectorTable';
import Treemap from './Treemap';

function getAvailableYears(data: MarchePublic[]) {
  return [
    ...new Set(
      data.map(
        (item) => item.datenotification_annee && item.montant && item.datenotification_annee,
      ),
    ),
  ].sort((a: number, b: number) => a - b);
}

export default function Distribution({ data }: { data: MarchePublic[] }) {
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');
  const [isTableDisplayed, setIsTableDisplayed] = useState(false);

  const availableYears: number[] = getAvailableYears(data);

  const filteredData =
    selectedYear === 'All'
      ? data
      : data.filter((item) => item.datenotification_annee === selectedYear);

  function getTopSectors(data: any[]) {
    const groupedData = data.reduce(
      (acc, { cpv_2_label, montant }) => {
        if (!acc[cpv_2_label]) {
          acc[cpv_2_label] = 0;
        }
        acc[cpv_2_label] += parseFloat(String(montant));
        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedGroupedData = Object.entries(groupedData)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => Number(b.value) - Number(a.value));

    const total = data.reduce((acc, item) => acc + parseFloat(String(item.montant)), 0);
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
          <GraphSwitch
            isActive={isTableDisplayed}
            onChange={setIsTableDisplayed}
            label1='graphique'
            label2='tableau'
          />
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      {isTableDisplayed && <SectorTable data={formattedData} />}
      {!isTableDisplayed && <Treemap data={formattedData} />}
    </>
  );
}
