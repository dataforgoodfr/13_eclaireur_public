'use client';

import { useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import YearSelector from '@/app/community/[siren]/components/YearSelector';
import { MarchePublic } from '@/app/models/marche_public';
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

export default function Top10({ data }: { data: MarchePublic[] }) {
  const [linesDisplayed, setLinesDisplayed] = useState(0);
  const [selectedYear, setSelectedYear] = useState<YearOption>('All');

  const availableYears: number[] = getAvailableYears(data);

  const filteredData =
    selectedYear === 'All'
      ? data
      : data.filter((item) => item.datenotification_annee === selectedYear);

  function formatCompanies(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '')
      .split(/',\s*'|",\s*"/)
      .map((item) => item.replace(/^'|-'?$/g, '').trim());
  }

  function getTopContract(data: any[]) {
    const sortedContracts = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    const topContract =
      sortedContracts.length > 10 + 10 * linesDisplayed
        ? sortedContracts.slice(0, 10 + 10 * linesDisplayed)
        : sortedContracts;

    return topContract;
  }

  const topContractData = getTopContract(filteredData);

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Classement par tailles de contrats</h3>
        </div>
        <div className='flex items-center gap-2'>
          <YearSelector years={availableYears} onSelect={setSelectedYear} />
          <DownloadSelector />
        </div>
      </div>
      <Table className='min-h-[600px]'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[300px]'>Titulaires</TableHead>
            <TableHead className=''>Objet</TableHead>
            <TableHead className='w-[140px] text-right'>Montant</TableHead>
            <TableHead className='w-[140px] text-right'>Année</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topContractData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className='space-x-1'>
                {formatCompanies(item.titulaires_liste_noms).map((company, index) => (
                  <span key={index} className='py-.5 rounded-md bg-neutral-200 px-2'>
                    {company}
                  </span>
                ))}
              </TableCell>
              <TableCell className=''>{item.objet}</TableCell>
              <TableCell className='text-right'>{formatNumber(parseFloat(item.montant))}</TableCell>
              <TableCell className='text-right'>{item.datenotification_annee}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredData.length > 10 + 10 * linesDisplayed && (
        <div className='flex items-center justify-center pt-6'>
          <button
            className='rounded-md bg-neutral-600 px-3 py-1 text-neutral-100 hover:bg-neutral-800'
            onClick={() => setLinesDisplayed(linesDisplayed + 1)}
          >
            Voir plus
          </button>
        </div>
      )}
    </>
  );
}
