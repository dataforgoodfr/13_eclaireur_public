'use client';

import { PureComponent, useState } from 'react';

import DownloadSelector from '@/app/community/[siren]/components/DownloadDropDown';
import { Subvention } from '@/app/models/subvention';
import { Switch } from '@/components/ui/switch';
import { formatNumber } from '@/utils/utils';
import { random } from 'lodash';
import { Contrast } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type FormattedDataTrends = {
  annee: number;
  montant: number;
  nombre: number;
  budget?: number;
};

export default function Trends({ data }: { data: Subvention[] }) {
  const [subventionsCountDisplayed, setSubventionsCountDisplayed] = useState(false);

  function trends(data: Subvention[]) {
    const subventionsByYear: FormattedDataTrends[] = Object.values(
      data.reduce<Record<string, FormattedDataTrends>>((acc, item) => {
        const year = item.year;

        if (!acc[year]) {
          acc[year] = { annee: year, montant: 0, nombre: 0 };
        }
        acc[year].montant += parseFloat(String(item.montant)) || 0;
        acc[year].nombre += 1;

        return acc;
      }, {}),
    );

    // TODO : ajouter le montant budgeté
    // Fake budget
    const formattedData = subventionsByYear.map((item) => {
      const budget = item.montant * (1 + Math.random() * 3);
      const stackedBudget = budget - item.montant;
      const tauxPublication = item.montant / budget;

      return { ...item, budget, stackedBudget, tauxPublication };
    });

    return formattedData;
  }

  const formattedData = trends(data);
  console.log(formattedData);

  const renderLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill='#4e4e4e'
        textAnchor='middle'
        dominantBaseline='middle'
        fontSize='16'
      >
        {formatNumber(value)} €
      </text>
    );
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-baseline gap-2'>
          <h3 className='py-2 text-xl'>Évolution des subventions au cours du temps</h3>
          <div className='flex items-baseline gap-2'>
            <div
              onClick={() => setSubventionsCountDisplayed(false)}
              className={`cursor-pointer ${!subventionsCountDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              (Montants annuels
            </div>
            <Switch
              checked={subventionsCountDisplayed}
              onCheckedChange={() => setSubventionsCountDisplayed((prev) => !prev)}
            />
            <div
              onClick={() => setSubventionsCountDisplayed(true)}
              className={`cursor-pointer ${subventionsCountDisplayed ? 'text-neutral-800' : 'text-neutral-400'}`}
            >
              Nombre de subventions)
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='rounded p-1 hover:bg-neutral-100'>
            <Contrast className='text-neutral-500' />
          </div>
          <DownloadSelector />
        </div>
      </div>
      <div className='border p-4'>
        <ResponsiveContainer width='100%' height={600}>
          <BarChart
            width={500}
            height={300}
            data={formattedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='annee' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='montant' stackId='a' fill='#8884d8' />
            <Bar dataKey='stackedBudget' stackId='a' fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
