'use client';

import { useState } from 'react';

import { MarchePublic } from '@/app/models/marche_public';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowDownToLine } from 'lucide-react';

export default function Top10({ rawData }: { rawData: any[] }) {
  const [categoriesDisplayed, setCategoriesDisplayed] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');

  // Selecter
  const availableYears = [...new Set(rawData.map((item) => item.datenotification_annee))].sort(
    (a, b) => Number(a) - Number(b),
  );

  let filteredData: MarchePublic[];
  if (selectedYear === 'All') {
    filteredData = rawData;
  } else {
    filteredData = rawData.filter((item) => item.datenotification_annee === selectedYear);
  }

  function formatNumberWithSpaces(number: number): string {
    return number.toLocaleString('fr-FR');
  }

  function formatCompanies(input: string): string[] {
    return input
      .replace(/[\[\]]/g, '')
      .split(/',\s*'|",\s*"/)
      .map((item) => item.replace(/^'|-'?$/g, '').trim());
  }

  function getTop10Contract(data: any[]) {
    const sortedContracts = data.sort((a, b) => Number(b.montant) - Number(a.montant));
    let Top10Contract = [];
    if (sortedContracts.length > 10) {
      Top10Contract = sortedContracts.slice(0, 10);
    } else {
      Top10Contract = sortedContracts;
    }
    return Top10Contract;
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

    const total = filteredData.reduce((acc, item) => acc + parseFloat(item.montant), 0);
    const top1 = Math.max(...Object.values(groupedData).map(Number));

    const formattedData = Object.entries(groupedData)
      .map(([name, size]) => ({ name, size }))
      .sort((a, b) => Number(b.size) - Number(a.size));

    const formattedPlusTotal = formattedData.map((item) => ({
      ...item,
      part: Math.round((Number(item.size) / total) * 100 * 10) / 10,
      pourcentageCategoryTop1: Math.round((Number(item.size) / top1) * 100 * 10) / 10,
    }));

    let Top10Sector;
    if (formattedPlusTotal.length > 10) {
      Top10Sector = formattedPlusTotal.slice(0, 10);
    } else {
      Top10Sector = formattedPlusTotal;
    }
    return Top10Sector;
  }

  const getTop10SectorData = getTop10Sector(filteredData);
  const getTop10ContractData = getTop10Contract(filteredData);

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
          <Select onValueChange={(value) => setSelectedYear(value)}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Tout voir' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='All'>Tout voir</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='rounded p-1 hover:bg-neutral-100'>
                <ArrowDownToLine className='text-neutral-500' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Télécharger les données</DropdownMenuItem>
              <DropdownMenuItem>Télécharger le tableau</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {categoriesDisplayed && (
        <Table className='min-h-[600px]'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[400px]'>Secteur</TableHead>
              <TableHead className='w-[700px]'>Montant</TableHead>
              <TableHead className=''></TableHead>
              <TableHead className='text-right'>Part</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getTop10SectorData.map((item, index) => (
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
                <TableCell>{formatNumberWithSpaces(Number(item.size))} €</TableCell>
                <TableCell className='text-right'>{`${item.part}%`}</TableCell>
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
              <TableHead className='w-[140px] text-right'>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getTop10ContractData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='space-x-1 font-medium'>
                  {formatCompanies(item.titulaires_liste_noms).map((company, index) => (
                    <span key={index} className='py-.5 rounded-md bg-neutral-200 px-2'>
                      {company}
                    </span>
                  ))}
                </TableCell>
                <TableCell className=''>{item.objet}</TableCell>
                <TableCell className='text-right'>
                  {formatNumberWithSpaces(Number(item.montant))} €
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}
