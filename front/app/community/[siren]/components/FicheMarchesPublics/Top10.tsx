'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { MarchePublic } from '@/app/models/marchePublic';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/utils/utils';

type YearOption = number | 'All';

function getAvailableYears(data: MarchePublic[]) {
  return [...new Set(data.map((item) => item.datenotification_annee))].sort(
    (a: number, b: number) => a - b,
  );
}

export default function Top10({ rawData }: { rawData: MarchePublic[] }) {
  const [categoriesDisplayed, setCategoriesDisplayed] = useState(false);
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');

  const availableYears: number[] = getAvailableYears(rawData);

  const filteredData =
    selectedYear === 'All'
      ? rawData
      : rawData.filter((item) => item.datenotification_annee === selectedYear);

  function formatCompanies(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '')
      .split(/',\s*'|",\s*"/)
      .map((item) => item.replace(/^'|-'?$/g, '').trim());
  }

  function getTop10Contract(data: any[]) {
    const sortedContracts = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    const top10Contract =
      sortedContracts.length > 10 ? sortedContracts.slice(0, 10) : sortedContracts;

    return top10Contract;
  }

  function getTop10Sector(data: any[]) {
    const groupedData = data.reduce(
      (acc, { cpv_2_label, montant }) => {
        if (!acc[cpv_2_label]) {
          acc[cpv_2_label] = 0;
        }
        acc[cpv_2_label] += parseFloat(montant);
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = filteredData.reduce((acc, item) => acc + parseFloat(String(item.montant)), 0);
    const top1 = Math.max(...Object.values(groupedData).map(Number));

    const formattedData = Object.entries(groupedData)
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => Number(b.size) - Number(a.size));

    const formattedPlusTotal = formattedData.map((item) => ({
      ...item,
      part: Math.round((Number(item.size) / total) * 100 * 10) / 10,
      pourcentageCategoryTop1: Math.round((Number(item.size) / top1) * 100 * 10) / 10,
    }));

    const top10Sector =
      formattedPlusTotal.length > 10 ? formattedPlusTotal.slice(0, 10) : formattedPlusTotal;

    return top10Sector;
  }

  const top10SectorData = getTop10Sector(filteredData);
  const top10ContractData = getTop10Contract(filteredData);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Top 10 </h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => setCategoriesDisplayed(false)}
              className={`cursor-pointer ${!categoriesDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (des contrats
            </div>
            <Switch
              checked={categoriesDisplayed}
              onCheckedChange={() => setCategoriesDisplayed((prev) => !prev)}
            />
            <div
              onClick={() => setCategoriesDisplayed(true)}
              className={`cursor-pointer ${categoriesDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              par secteurs)
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      {categoriesDisplayed && (
        <Table className='min-h-[600px]'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[400px]'>Secteur</TableHead>
              <TableHead className='w-[500px]'></TableHead>
              <TableHead className='text-right'>Montant (€)</TableHead>
              <TableHead className='text-right'>Part (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top10SectorData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>{item.name}</TableCell>
                <TableCell>
                  <div className='relative h-2 w-full rounded-md'>
                    <div
                      className='h-2 rounded-md bg-blue-500'
                      style={{ width: `${item.pourcentageCategoryTop1}%` }}
                    ></div>
                  </div>
                </TableCell>
                <TableCell className='text-right'>{formatNumber(Number(item.size))}</TableCell>
                <TableCell className='text-right'>{item.part}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {!categoriesDisplayed && (
        <Table className='min-h-[600px]'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[300px]'>Titulaires</TableHead>
              <TableHead className=''>Objet</TableHead>
              <TableHead className='w-[140px] text-right'>Montant (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top10ContractData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='space-x-1'>
                  {formatCompanies(item.titulaires_liste_noms).map((company, index) => (
                    <span key={index} className='py-.5 rounded-md bg-neutral-200 px-2'>
                      {company}
                    </span>
                  ))}
                </TableCell>
                <TableCell>{item.objet}</TableCell>
                <TableCell className='text-right'>{formatNumber(Number(item.montant))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
